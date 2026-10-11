param([Parameter(ValueFromRemainingArguments=$true)]$RemainingArgs)
& python "$PSScriptRoot\ovio_cli.py" @RemainingArgs
