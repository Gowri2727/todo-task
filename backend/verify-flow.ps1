$email = 'testuser' + [DateTime]::UtcNow.ToString('yyyyMMddHHmmss') + '@example.com'
$body = @{name='Test User'; email=$email; password='Password1'; confirmPassword='Password1'} | ConvertTo-Json
$register = Invoke-RestMethod -Uri 'http://127.0.0.1:5000/api/auth/register' -Method Post -ContentType 'application/json' -Body $body
$token = $register.data.token
$headers = @{ Authorization = 'Bearer ' + $token }
$taskBody = @{title='Verify task flow'; description='Created from terminal'; priority='High'; category='Work'; deadline=(Get-Date).AddDays(2).ToString('o')} | ConvertTo-Json
$task = Invoke-RestMethod -Uri 'http://127.0.0.1:5000/api/tasks' -Method Post -ContentType 'application/json' -Body $taskBody -Headers $headers
Write-Host ('REGISTERED=' + [string]$register.success)
Write-Host ('TASK_CREATED=' + [string]$task.success)
Write-Host ('TASK_ID=' + [string]$task.data._id)
