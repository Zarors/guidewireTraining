-- high water mark for sessions (since Oracle was started)
select sessions_max, sessions_warning, sessions_current, sessions_highwater from v$license
