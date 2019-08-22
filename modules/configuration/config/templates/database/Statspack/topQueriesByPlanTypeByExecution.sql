SELECT * FROM
(SELECT old_hash_value, CASE SUM(executions) WHEN 0 THEN 0 ELSE SUM(${columnToSum})/SUM(executions) END AS "${sumColumnName}/Execution"
FROM
(
SELECT old_hash_value, -${columnToSum} AS ${columnToSum}, -executions AS executions
FROM stats$sql_summary s
WHERE snap_id = ${beginSnap} AND s.module = '${moduleName}' AND EXISTS
(SELECT * FROM stats$sql_plan p, stats$sql_plan_usage u
   WHERE s.old_hash_value = u.old_hash_value and u.plan_hash_value = p.plan_hash_value AND p.operation = '${planPattern}' AND s.snap_id = p.snap_id)
UNION ALL
SELECT old_hash_value, ${columnToSum} AS ${columnToSum}, executions AS executions
FROM stats$sql_summary s
WHERE snap_id = ${endSnap} AND s.module = '${moduleName}' AND EXISTS
(SELECT * FROM stats$sql_plan p, stats$sql_plan_usage u
   WHERE s.old_hash_value = u.old_hash_value and u.plan_hash_value = p.plan_hash_value AND p.operation = '${planPattern}' AND s.snap_id = p.snap_id)
) c
GROUP BY old_hash_value
HAVING CASE SUM(executions) WHEN 0 THEN 0 ELSE SUM(${columnToSum})/SUM(executions) END >= 0
ORDER BY 2 desc
) derived_table WHERE rownum <= ${maxRows}
