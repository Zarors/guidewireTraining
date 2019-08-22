SELECT * FROM
(SELECT old_hash_value, SUM(${columnToSum}) AS "${sumColumnName}"
FROM
(
SELECT old_hash_value, -${columnToSum} AS ${columnToSum}
FROM stats$sql_summary s
WHERE snap_id = ${beginSnap} AND s.module = '${moduleName}'
UNION ALL
SELECT old_hash_value, ${columnToSum} AS ${columnToSum}
FROM stats$sql_summary s
WHERE snap_id = ${endSnap} AND s.module = '${moduleName}' 
) c
GROUP BY old_hash_value
HAVING SUM(${columnToSum}) = 0
ORDER BY 2 desc
) derived_table WHERE rownum <= ${maxRows}
