DELETE FROM signupTokens
WHERE creationTimestamp <= strftime('%s', datetime('now', '-10 hours'));