# Nexify Migration Guide - Safe File Restructuring

## ⚠️ Important: Read Before Starting

This guide ensures you can restructure your codebase WITHOUT breaking any functionality.

## 🛡️ Safety Checklist

- [ ] Create a backup (the script does this automatically)
- [ ] Commit all current changes to git
- [ ] Have the app running to test after each change
- [ ] Move one feature at a time
- [ ] Update imports immediately after moving files

## 📋 Step-by-Step Migration Process

### Phase 1: Preparation

1. **Run the restructure script**:
   ```bash
   ./restructure.sh
   ```
   This creates the new directory structure without moving any files.

2. **Keep the server running** in one terminal:
   ```bash
   npm start
   ```

3. **Keep the client running** in another terminal:
   ```bash
   cd client && npm start
   ```

### Phase 2: Server-Side Migration

#### Step 1: Move Models (Low Risk)

1. **User Models**:
   ```bash
   # Copy (don't move yet)
   cp server/models/user.model.js server/src/models/user/
   cp server/models/preference.model.js server/src/models/user/
   cp server/models/context.model.js server/src/models/user/
   ```

2. **Update imports in the copied files**:
   ```javascript
   // OLD: const User = require("../models/user.model");
   // NEW: const User = require("../../models/user/user.model");
   ```

3. **Test** - Make sure login still works

4. **If working, remove old files**:
   ```bash
   rm server/models/user.model.js
   rm server/models/preference.model.js
   rm server/models/context.model.js
   ```

#### Step 2: Move Controllers with Routes

1. **Auth Feature**:
   ```bash
   # Copy files
   cp server/controllers/auth.controller.js server/src/api/v1/auth/
   cp server/routes/context-auth.route.js server/src/api/v1/auth/auth.routes.js
   ```

2. **Update imports**:
   ```javascript
   // In auth.controller.js
   // OLD: const User = require("../models/user.model");
   // NEW: const User = require("../../../models/user/user.model");
   ```

3. **Update route file in app.js**:
   ```javascript
   // OLD: const contextAuthRoutes = require("./routes/context-auth.route");
   // NEW: const contextAuthRoutes = require("./src/api/v1/auth/auth.routes");
   ```

### Phase 3: Client-Side Migration

#### Step 1: Move Feature Components

1. **Posts Feature**:
   ```bash
   # Copy post components
   cp -r client/src/components/post/* client/src/features/posts/components/
   cp client/src/pages/Post.jsx client/src/features/posts/pages/
   ```

2. **Update imports in Post.jsx**:
   ```javascript
   // OLD: import PostView from "../components/post/PostView";
   // NEW: import PostView from "../components/PostView";
   ```

3. **Update route imports**:
   ```javascript
   // In routes.js
   // OLD: import Post from "./pages/Post";
   // NEW: import Post from "./features/posts/pages/Post";
   ```

### Phase 4: Update Import Paths

#### Import Path Mapping Table

| Old Path | New Path |
|----------|----------|
| `../models/user.model` | `../../../models/user/user.model` |
| `../controllers/auth.controller` | `../../../api/v1/auth/auth.controller` |
| `./components/post/Post` | `./features/posts/components/Post` |
| `./pages/Profile` | `./features/profile/pages/Profile` |

### Phase 5: Testing After Each Move

1. **Test Authentication**:
   - Login/Logout
   - Sign up
   - Email verification

2. **Test Posts**:
   - Create post
   - View posts
   - Like/Comment

3. **Test Profile**:
   - View own profile
   - View other profiles
   - Edit profile

## 🔧 Common Issues and Fixes

### Issue 1: Module Not Found
```
Error: Cannot find module '../models/user.model'
```
**Fix**: Update the import path to the new location

### Issue 2: Circular Dependencies
**Fix**: Check if two files are importing each other. Break the cycle by moving shared code to a utils file.

### Issue 3: Routes Not Working
**Fix**: Make sure app.js is importing from the new route locations

## 📝 Update Checklist for Each File Move

- [ ] Copy file to new location
- [ ] Update all imports IN the file
- [ ] Update all imports TO the file (search project for old path)
- [ ] Test the specific feature
- [ ] If working, delete old file
- [ ] Commit the change

## 🚀 Final Steps

1. **Run full test suite**:
   ```bash
   npm test
   ```

2. **Build the client**:
   ```bash
   cd client && npm run build
   ```

3. **Update documentation**:
   - Update README with new structure
   - Update API documentation

4. **Clean up**:
   - Remove empty directories
   - Delete backup if everything works

## 💡 Tips

1. **Use VSCode's "Find and Replace"** (Cmd+Shift+F) to update import paths
2. **Move related files together** (e.g., move all auth files at once)
3. **Test immediately** after each move
4. **Commit often** - after each successful feature migration

## 🎯 Benefits After Migration

- ✅ Cleaner, more organized codebase
- ✅ Easier to find files
- ✅ Better separation of concerns
- ✅ Easier to add new features
- ✅ More maintainable code
- ✅ No functionality changes - everything works the same!