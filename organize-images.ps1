# Create directories if they don't exist
$directories = @(
    "public\assets\images\features",
    "public\assets\images\landing",
    "public\assets\images\dogs",
    "public\assets\images\ui",
    "public\assets\images\marketing",
    "public\assets\icons\features"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "Created directory: $dir"
    }
}

# Copy logo
Copy-Item "public\assets\PetPals Images\PetPalsLogo.png" -Destination "public\assets\logos\petpals-logo.png" -Force

# Copy landing page images
Copy-Item "public\assets\PetPals Images\landingpage4square.png" -Destination "public\assets\images\landing\hero-section.png" -Force
Copy-Item "public\assets\PetPals Images\landingpage4square1.png" -Destination "public\assets\images\landing\features-section.png" -Force
Copy-Item "public\assets\PetPals Images\landingpage4square2.png" -Destination "public\assets\images\landing\testimonials-section.png" -Force
Copy-Item "public\assets\PetPals Images\landingpagefaq.png" -Destination "public\assets\images\landing\faq-section.png" -Force
Copy-Item "public\assets\PetPals Images\petpals3dogimage.png" -Destination "public\assets\images\landing\hero-dogs.png" -Force
Copy-Item "public\assets\PetPals Images\petpals3dogimage2.png" -Destination "public\assets\images\landing\hero-dogs-alt.png" -Force

# Copy dashboard/features images
Copy-Item "public\assets\PetPals Images\landingpagedashboard1.png" -Destination "public\assets\images\features\dashboard-overview.png" -Force
Copy-Item "public\assets\PetPals Images\landingpagedashboard2.png" -Destination "public\assets\images\features\health-tracking.png" -Force
Copy-Item "public\assets\PetPals Images\landingpagedashboard3.png" -Destination "public\assets\images\features\breeding-tools.png" -Force
Copy-Item "public\assets\PetPals Images\landingpagedashboard5.png" -Destination "public\assets\images\features\community-features.png" -Force
Copy-Item "public\assets\PetPals Images\landingpagedashboard6.png" -Destination "public\assets\images\features\marketplace.png" -Force
Copy-Item "public\assets\PetPals Images\landingpageaidashboard.png" -Destination "public\assets\images\features\ai-dashboard.png" -Force
Copy-Item "public\assets\PetPals Images\landingpageaidashboard2.png" -Destination "public\assets\images\features\ai-recommendations.png" -Force

# Copy dog images
Copy-Item "public\assets\PetPals Images\petpalsdnafrenchie.png" -Destination "public\assets\images\dogs\frenchie-profile.png" -Force
Copy-Item "public\assets\PetPals Images\petpalsdnafrenchie1.png" -Destination "public\assets\images\dogs\frenchie-dna.png" -Force
Copy-Item "public\assets\PetPals Images\petpalsdnafrenchie2.png" -Destination "public\assets\images\dogs\frenchie-health.png" -Force
Copy-Item "public\assets\PetPals Images\petpalsdnafrenchie3.png" -Destination "public\assets\images\dogs\frenchie-pedigree.png" -Force
Copy-Item "public\assets\PetPals Images\petpalsdnafrenchie4.png" -Destination "public\assets\images\dogs\frenchie-breeding.png" -Force
Copy-Item "public\assets\PetPals Images\petpalsdnalab.png" -Destination "public\assets\images\dogs\lab-profile.png" -Force

# Copy UI elements
Copy-Item "public\assets\PetPals Images\iphoneframe.png" -Destination "public\assets\images\ui\iphone-frame.png" -Force
Copy-Item "public\assets\PetPals Images\iphoneframe2.png" -Destination "public\assets\images\ui\iphone-frame-2.png" -Force
Copy-Item "public\assets\PetPals Images\iphoneframe3.png" -Destination "public\assets\images\ui\iphone-frame-3.png" -Force
Copy-Item "public\assets\PetPals Images\iphoneframe4.png" -Destination "public\assets\images\ui\iphone-frame-4.png" -Force
Copy-Item "public\assets\PetPals Images\petpals styleguide.png" -Destination "public\assets\images\ui\styleguide.png" -Force
Copy-Item "public\assets\PetPals Images\petpalstypograoghy.png" -Destination "public\assets\images\ui\typography.png" -Force

# Copy marketing images
Copy-Item "public\assets\PetPals Images\collague5image.png" -Destination "public\assets\images\marketing\collage-1.png" -Force
Copy-Item "public\assets\PetPals Images\collague5image.2.png" -Destination "public\assets\images\marketing\collage-2.png" -Force
Copy-Item "public\assets\PetPals Images\ugc testimonials.png" -Destination "public\assets\images\marketing\testimonials.png" -Force
Copy-Item "public\assets\PetPals Images\ugc3splitimage.png" -Destination "public\assets\images\marketing\split-1.png" -Force
Copy-Item "public\assets\PetPals Images\ugc3splitimage2.png" -Destination "public\assets\images\marketing\split-2.png" -Force

# Copy cartoon/icon images
Copy-Item "public\assets\PetPals Images\petpalscartoonimage.png" -Destination "public\assets\images\marketing\cartoon-1.png" -Force
Copy-Item "public\assets\PetPals Images\petpalscartoonimage1.png" -Destination "public\assets\images\marketing\cartoon-2.png" -Force
Copy-Item "public\assets\PetPals Images\petpalscartoonimage2.png" -Destination "public\assets\images\marketing\cartoon-3.png" -Force
Copy-Item "public\assets\PetPals Images\petpalsicons.png" -Destination "public\assets\icons\features\icon-set-1.png" -Force
Copy-Item "public\assets\PetPals Images\petpalsicons2.png" -Destination "public\assets\icons\features\icon-set-2.png" -Force

# Copy DNA/health images
Copy-Item "public\assets\PetPals Images\petpalsdna.png" -Destination "public\assets\images\features\dna-analysis.png" -Force
Copy-Item "public\assets\PetPals Images\petpalshealthcheck1.png" -Destination "public\assets\images\features\health-check-1.png" -Force
Copy-Item "public\assets\PetPals Images\petpalshealthcheck2.png" -Destination "public\assets\images\features\health-check-2.png" -Force

Write-Host "All images have been organized into their appropriate directories."
