#!/bin/bash

# Nexify Codebase Restructuring Script
# This script will reorganize files into a better structure
# WITHOUT changing any functionality

echo "🚀 Starting Nexify codebase restructuring..."
echo "⚠️  This will reorganize files but NOT change any functionality"
echo ""

# Create backup first
echo "📦 Creating backup..."
timestamp=$(date +%Y%m%d_%H%M%S)
backup_dir="nexify_backup_$timestamp"
mkdir -p "../$backup_dir"
cp -r server "../$backup_dir/"
cp -r client "../$backup_dir/"
echo "✅ Backup created at ../$backup_dir"

# Function to create directories
create_server_structure() {
    echo "📁 Creating new server directory structure..."
    
    # Create main directories
    mkdir -p server/src/{api/v1,models,middleware,services,utils,config}
    
    # Create API subdirectories
    mkdir -p server/src/api/v1/{auth,users,posts,communities,moderation,admin}
    
    # Create model subdirectories
    mkdir -p server/src/models/{user,content,community,moderation,auth,system}
    
    # Create middleware subdirectories
    mkdir -p server/src/middleware/{auth,validation,upload,limiter,logger}
    
    # Create service subdirectories
    mkdir -p server/src/services/{email,upload,search,cache}
    
    # Create utils subdirectories
    mkdir -p server/src/utils/{validators,helpers,constants}
    
    echo "✅ Server directory structure created"
}

create_client_structure() {
    echo "📁 Creating new client directory structure..."
    
    # Create feature directories
    mkdir -p client/src/features/{auth,posts,communities,profile,moderation,admin}
    
    # Create subdirectories for each feature
    for feature in auth posts communities profile moderation admin; do
        mkdir -p client/src/features/$feature/{components,pages,hooks,api,utils}
    done
    
    # Create shared directories
    mkdir -p client/src/shared/{components/{ui,layout,common},hooks,utils,constants}
    
    # Create store directories
    mkdir -p client/src/store/{slices,middleware}
    
    echo "✅ Client directory structure created"
}

# Function to show current vs new location mapping
show_file_mapping() {
    echo ""
    echo "📋 File Movement Plan:"
    echo "========================"
    echo ""
    echo "SERVER SIDE:"
    echo "  Models:"
    echo "    server/models/user.model.js → server/src/models/user/user.model.js"
    echo "    server/models/post.model.js → server/src/models/content/post.model.js"
    echo "    server/models/community.model.js → server/src/models/community/community.model.js"
    echo ""
    echo "  Controllers:"
    echo "    server/controllers/auth.controller.js → server/src/api/v1/auth/auth.controller.js"
    echo "    server/controllers/user.controller.js → server/src/api/v1/users/user.controller.js"
    echo "    server/controllers/post.controller.js → server/src/api/v1/posts/post.controller.js"
    echo ""
    echo "  Routes:"
    echo "    server/routes/user.route.js → server/src/api/v1/users/user.routes.js"
    echo "    server/routes/post.route.js → server/src/api/v1/posts/post.routes.js"
    echo ""
    echo "CLIENT SIDE:"
    echo "  Components:"
    echo "    client/src/components/post/* → client/src/features/posts/components/*"
    echo "    client/src/components/admin/* → client/src/features/admin/components/*"
    echo "    client/src/components/shared/* → client/src/shared/components/common/*"
    echo ""
    echo "  Pages:"
    echo "    client/src/pages/Post.jsx → client/src/features/posts/pages/Post.jsx"
    echo "    client/src/pages/Profile.jsx → client/src/features/profile/pages/Profile.jsx"
    echo ""
}

# Ask for confirmation
echo ""
echo "This script will:"
echo "1. Create a backup of current code"
echo "2. Create new directory structure"
echo "3. Show you the file mapping (no files will be moved automatically)"
echo ""
read -p "Do you want to proceed? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    create_server_structure
    create_client_structure
    show_file_mapping
    
    echo ""
    echo "✅ Directory structure created successfully!"
    echo ""
    echo "📝 Next Steps:"
    echo "1. Review the file mapping above"
    echo "2. Move files according to the mapping"
    echo "3. Update import paths in all files"
    echo "4. Test each component after moving"
    echo "5. Run 'npm test' to ensure everything works"
    echo ""
    echo "💡 Tip: Move one feature at a time and test before moving the next"
    echo ""
    echo "📄 See RESTRUCTURE_PLAN.md for detailed migration guide"
else
    echo "❌ Restructuring cancelled"
fi