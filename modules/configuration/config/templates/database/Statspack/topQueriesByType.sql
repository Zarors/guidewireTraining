SELECT * FROM
(SELECT old_hash_value, SUM(${columnToSum}) AS "${sumColumnName}"
FROM
(
SELECT old_hash_value, -${columnToSum} AS ${columnToSum}
FROM stats$sql_summary s
where snap_id = ${beginSnap}  AND s.module = '${moduleName}' AND EXISTS
(SELECT * FROM stats$sqltext t WHERE s.text_subset = t.text_subset AND s.old_hash_value = t.old_hash_value AND t.sql_text LIKE '${likePattern}')
UNION ALL
SELECT old_hash_value, ${columnToSum} AS ${columnToSum}
FROM stats$sql_summary s
WHERE snap_id = ${endSnap} AND s.module = '${moduleName}' AND EXISTS
(SELECT * FROM stats$sqltext t WHERE s.text_subset = t.text_subset AND s.old_hash_value = t.old_hash_value AND t.sql_text like '${likePattern}')
) c
GROUP BY old_hash_value
HAVING SUM(${columnToSum}) >= 0
ORDER BY 2 desc
) derived_table WHERE rownum <= ${maxRows}
