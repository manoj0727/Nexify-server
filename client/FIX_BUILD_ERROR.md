# Fix: react-scripts command not found

## The Error
```
sh: line 1: react-scripts: command not found
Error: Command 'npm run build' exited with 127
```

## Solutions

### Solution 1: Ensure Dependencies are Installed
Most deployment platforms need to install dependencies before building. Make sure your build command includes dependency installation:

**Update your deployment platform's build command to:**
```bash
cd client && npm install && npm run build
```

Or if you're using a single command field:
```bash
npm install && npm run build
```

### Solution 2: Check Build Settings on Your Platform

#### Vercel
1. Go to Project Settings → General
2. Set **Root Directory**: `client`
3. Set **Build Command**: `npm install && npm run build`
4. Set **Output Directory**: `build`

#### Netlify
1. Go to Site settings → Build & deploy
2. Set **Base directory**: `client`
3. Set **Build command**: `npm install && npm run build`
4. Set **Publish directory**: `client/build`

#### Railway/Render
1. Set **Root Directory**: `/client`
2. Set **Build Command**: `npm install && npm run build`
3. Set **Start Command**: `npx serve -s build`

### Solution 3: Add a Build Script
Create a build script in the root directory:

**Create `/build.sh`:**
```bash
#!/bin/bash
cd client
npm install
npm run build
```

Then use `sh build.sh` as your build command.

### Solution 4: Check Node Version
Some platforms default to older Node versions. Specify Node 16+ in your deployment:

**Add to `client/package.json`:**
```json
"engines": {
  "node": ">=16.0.0",
  "npm": ">=7.0.0"
}
```

**Or create `client/.nvmrc`:**
```
16
```

### Quick Checklist
- [ ] Build command includes `npm install`
- [ ] Correct working directory (client folder)
- [ ] Node version 16 or higher
- [ ] All dependencies in package.json (not globally installed)

## Platform-Specific Build Commands

### Full-stack deployment (client + server):
```bash
# Install both client and server dependencies
npm install && cd client && npm install && npm run build
```

### Client-only deployment:
```bash
# From client directory
npm install && npm run build
```

## Still Having Issues?

1. **Clear build cache** on your platform
2. **Check build logs** for the exact directory where commands run
3. **Verify package-lock.json** is committed (helps with consistent installs)
4. **Try a fresh deployment** from a new branch

The key is ensuring `npm install` runs before `npm run build` in the correct directory!