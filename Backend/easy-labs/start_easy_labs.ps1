# start_easy_labs.ps1
# PowerShell script to start all 5 Easy Red Team labs on local ports 5101-5105

Write-Host "🚀 Starting Easy Red Team Labs..." -ForegroundColor Cyan

# Check if labs exist in the current directory or Backend/easy-labs
$labDir = Get-Location
if (-not (Test-Path "$labDir/lab1_service_enum.py")) {
    if (Test-Path "$labDir/Backend/easy-labs/lab1_service_enum.py") {
        $labDir = "$labDir/Backend/easy-labs"
        Set-Location $labDir
    }
    elseif (Test-Path "$labDir/easy-labs/lab1_service_enum.py") {
        $labDir = "$labDir/easy-labs"
        Set-Location $labDir
    }
    else {
        Write-Error "Could not find lab files. Please run this script from the project root or Backend/easy-labs directory."
        exit
    }
}

$labs = @(
    @{ Name = "Lab 1: Service Enumeration"; File = "lab1_service_enum.py" },
    @{ Name = "Lab 2: Version Detection"; File = "lab2_version_detection.py" },
    @{ Name = "Lab 3: Robots.txt Leak"; File = "lab3_robots_leak.py" },
    @{ Name = "Lab 4: Hidden Directory"; File = "lab4_hidden_dir.py" },
    @{ Name = "Lab 5: Default Credentials"; File = "lab5_default_creds.py" }
)

foreach ($lab in $labs) {
    Write-Host "Starting $($lab.Name)..."
    # Run in background without opening new windows
    # We use 'python' as default, but we can try common alternatives
    try {
        Start-Process python -ArgumentList $lab.File -NoNewWindow
    }
    catch {
        Write-Warning "Failed to start with 'python', trying 'py'..."
        try {
            Start-Process py -ArgumentList $lab.File -NoNewWindow
        }
        catch {
            Write-Error "Could not start $($lab.File). Make sure Python is installed and in your PATH."
        }
    }
}

Write-Host "`n✅ All 5 labs have been triggered!" -ForegroundColor Green
Write-Host "Ports 5101-5105 should now be active."
Write-Host "You can verify by visiting http://localhost:5101 in your browser."
