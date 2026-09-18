#!/usr/bin/env python3
import sys, subprocess, json, re, urllib.request, urllib.parse
from datetime import datetime, timezone, timedelta

MIN_AGE = timedelta(hours=24)

def diff_files(base, head):
    out = subprocess.run(['git', 'diff', '--name-only', f'{base}...{head}'], capture_output=True, text=True)
    return out.stdout.splitlines()

def file_at(ref, path):
    out = subprocess.run(['git', 'show', f'{ref}:{path}'], capture_output=True, text=True)
    return out.stdout if out.returncode == 0 else None

def npm_versions(content):
    if not content:
        return {}
    try:
        data = json.loads(content)
    except Exception:
        return {}
    versions = {}
    pkgs = data.get('packages')
    if isinstance(pkgs, dict):
        for path, info in pkgs.items():
            if not path:
                continue
            name = info.get('name')
            if not name:
                m = re.search(r'node_modules/(.+)$', path)
                if not m:
                    continue
                name = m.group(1)
            v = info.get('version')
            if v:
                versions[name] = v
    else:
        def walk(d):
            if not isinstance(d, dict):
                return
            for name, info in d.items():
                v = info.get('version')
                if v:
                    versions[name] = v
                walk(info.get('dependencies'))
        walk(data.get('dependencies'))
    return versions

def composer_versions(content):
    if not content:
        return {}
    try:
        data = json.loads(content)
    except Exception:
        return {}
    versions = {}
    for pkg in data.get('packages', []) + data.get('packages-dev', []):
        name = pkg.get('name')
        v = pkg.get('version')
        if name and v:
            versions[name] = v
    return versions

def pip_versions(content):
    if not content:
        return {}
    versions = {}
    for line in content.splitlines():
        line = line.strip()
        m = re.match(r'^([A-Za-z0-9_.\-]+)==([A-Za-z0-9_.\-]+)', line)
        if m:
            versions[m.group(1)] = m.group(2)
    return versions

def changed_versions(base, head, path, parser):
    old = parser(file_at(base, path))
    new = parser(file_at(head, path))
    changed = {}
    for name, v in new.items():
        if old.get(name) != v:
            changed[name] = v
    return changed

def http_json(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'dependency-age-check'})
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read().decode())

def npm_publish_time(name, version):
    try:
        data = http_json(f'https://registry.npmjs.org/{urllib.parse.quote(name, safe="@/")}')
        t = data.get('time', {}).get(version)
        if t:
            return datetime.fromisoformat(t.replace('Z', '+00:00'))
    except Exception as e:
        print(f'  warning: could not check npm age for {name}@{version}: {e}')
    return None

def composer_publish_time(name, version):
    try:
        data = http_json(f'https://repo.packagist.org/p2/{name}.json')
        for pkg_version in data.get('packages', {}).get(name, []):
            if pkg_version.get('version') == version:
                t = pkg_version.get('time')
                if t:
                    return datetime.fromisoformat(t)
    except Exception as e:
        print(f'  warning: could not check composer age for {name}@{version}: {e}')
    return None

def pip_publish_time(name, version):
    try:
        data = http_json(f'https://pypi.org/pypi/{name}/{version}/json')
        urls = data.get('urls', [])
        if urls:
            t = urls[0].get('upload_time_iso_8601')
            if t:
                return datetime.fromisoformat(t.replace('Z', '+00:00'))
    except Exception as e:
        print(f'  warning: could not check pip age for {name}@{version}: {e}')
    return None

def main():
    base, head = sys.argv[1], sys.argv[2]
    files = diff_files(base, head)
    violations = []
    now = datetime.now(timezone.utc)

    checks = [
        ('package-lock.json', npm_versions, npm_publish_time, 'npm'),
        ('composer.lock', composer_versions, composer_publish_time, 'composer'),
        ('requirements.txt', pip_versions, pip_publish_time, 'pip'),
    ]

    for path, parser, publish_time_fn, ecosystem in checks:
        if path not in files:
            continue
        changed = changed_versions(base, head, path, parser)
        for name, version in changed.items():
            t = publish_time_fn(name, version)
            if t is None:
                continue
            age = now - t
            if age < MIN_AGE:
                violations.append(f'{ecosystem}: {name}@{version} published {age} ago (< 24h) at {t.isoformat()}')

    if violations:
        print('Dependency age check FAILED. The following packages were published less than 24 hours ago:')
        for v in violations:
            print(f'  - {v}')
        sys.exit(1)

    print('Dependency age check passed. No newly-introduced package is less than 24 hours old.')

if __name__ == '__main__':
    main()
