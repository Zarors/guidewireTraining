SELECT * FROM
(SELECT old_hash_value, CASE SUM(executions) WHEN 0 THEN 0 ELSE SUM(${columnToSum})/SUM(executions) END AS "${sumColumnName}/Execution"
FROM
(
SELECT old_hash_value, -${columnToSum} AS ${columnToSum}, -executions AS executions
FROM stats$sql_summary s
WHERE snap_id = ${beginSnap} AND s.module = '${moduleName}'
UNION ALL
SELECT old_hash_value, ${columnToSum} AS ${columnToSum}, executions AS executions
FROM stats$sql_summary s
WHERE snap_id = ${endSnap} AND s.module = '${moduleName}'
) c
GROUP BY old_hash_value
HAVING CASE SUM(executions) WHEN 0 THEN 0 ELSE SUM(${columnToSum})/SUM(executions) END = 0
ORDER BY 2 desc
) derived_table WHERE rownum <= ${maxRows}
