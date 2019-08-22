SELECT OrderCol, "Summary", "Total Disk Reads", "Total Buffer Gets", "Total Executions", "Total CPU Time", "Total Elapsed Time"
FROM (
SELECT 1 AS OrderCol,
       'Total' AS "Summary",
       SUM("Total Disk Reads") AS "Total Disk Reads",
       SUM("Total Buffer Gets") AS "Total Buffer Gets",
       SUM("Total Executions") AS "Total Executions",
       SUM("Total CPU Time") AS "Total CPU Time",
       SUM("Total Elapsed Time") AS "Total Elapsed Time"
FROM (
SELECT LAG(disk_reads, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id) as "Total Disk Reads" ,
       LAG(buffer_gets, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id) as "Total Buffer Gets",
       LAG(executions, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total Executions",
       LAG(cpu_time/1000000, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total CPU Time",
       LAG(elapsed_time/1000000, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total Elapsed Time"
FROM stats$sql_summary s
WHERE snap_id = ${endSnap}
) c
UNION ALL
SELECT 2 AS OrderCol,
      'Bean Queries' AS "Summary",
      SUM("Total Disk Reads") AS "Total Disk Reads",
      SUM("Total Buffer Gets") AS "Total Buffer Gets",
      SUM("Total Executions") AS "Total Executions",
      SUM("Total CPU Time") AS "Total CPU Time",
      SUM("Total Elapsed Time") AS "Total Elapsed Time"
FROM (
SELECT LAG(disk_reads, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id) as "Total Disk Reads" ,
       LAG(buffer_gets, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id) as "Total Buffer Gets",
       LAG(executions, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total Executions",
       LAG(cpu_time/1000000, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total CPU Time",
       LAG(elapsed_time/1000000, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total Elapsed Time"
FROM stats$sql_summary s
WHERE snap_id = ${endSnap} AND EXISTS
  (SELECT * FROM stats$sqltext t WHERE s.text_subset = t.text_subset AND s.old_hash_value = t.old_hash_value AND t.sql_text LIKE '%bRoot%')
) c
UNION ALL
SELECT 3 AS OrderCol,
       'Rule/Bean Queries' AS "Summary",
       SUM("Total Disk Reads") AS "Total Disk Reads",
       SUM("Total Buffer Gets") AS "Total Buffer Gets",
       SUM("Total Executions") AS "Total Executions",
       SUM("Total CPU Time") AS "Total CPU Time",
       SUM("Total Elapsed Time") AS "Total Elapsed Time"
FROM (
SELECT LAG(disk_reads, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id) as "Total Disk Reads" ,
       LAG(buffer_gets, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id) as "Total Buffer Gets",
       LAG(executions, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total Executions",
       LAG(cpu_time/1000000, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total CPU Time",
       LAG(elapsed_time/1000000, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total Elapsed Time"
FROM stats$sql_summary s
WHERE snap_id = ${endSnap} AND EXISTS
  (SELECT * FROM stats$sqltext t WHERE s.text_subset = t.text_subset AND s.old_hash_value = t.old_hash_value AND t.sql_text LIKE '%rbRoot%')
) c
UNION ALL
SELECT 4 AS OrderCol,
       'Query Generator Queries' AS "Summary",
       SUM("Total Disk Reads") AS "Total Disk Reads",
       SUM("Total Buffer Gets") AS "Total Buffer Gets",
       SUM("Total Executions") AS "Total Executions",
       SUM("Total CPU Time") AS "Total CPU Time",
       SUM("Total Elapsed Time") AS "Total Elapsed Time"
FROM (
SELECT LAG(disk_reads, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id) as "Total Disk Reads" ,
       LAG(buffer_gets, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id) as "Total Buffer Gets",
       LAG(executions, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total Executions",
       LAG(cpu_time/1000000, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total CPU Time",
       LAG(elapsed_time/1000000, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total Elapsed Time"
FROM stats$sql_summary s
WHERE snap_id = ${endSnap} AND EXISTS
  (SELECT * FROM stats$sqltext t WHERE s.text_subset = t.text_subset AND s.old_hash_value = t.old_hash_value AND t.sql_text LIKE '%qRoot%')
) c
UNION ALL
SELECT 5 AS OrderCol,
       'Search Queries with LIKE' AS "Summary",
       SUM("Total Disk Reads") AS "Total Disk Reads",
       SUM("Total Buffer Gets") AS "Total Buffer Gets",
       SUM("Total Executions") AS "Total Executions",
       SUM("Total CPU Time") AS "Total CPU Time",
       SUM("Total Elapsed Time") AS "Total Elapsed Time"
FROM (
SELECT LAG(disk_reads, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id) as "Total Disk Reads" ,
       LAG(buffer_gets, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id) as "Total Buffer Gets",
       LAG(executions, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total Executions",
       LAG(cpu_time/1000000, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total CPU Time",
       LAG(elapsed_time/1000000, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total Elapsed Time"
FROM stats$sql_summary s
WHERE snap_id = ${endSnap} AND EXISTS
  (SELECT * FROM stats$sqltext t WHERE s.text_subset = t.text_subset AND s.old_hash_value = t.old_hash_value AND t.sql_text LIKE '%LIKE%')
) c
UNION ALL
SELECT 6 AS OrderCol,
       'Inserts' AS "Summary",
       SUM("Total Disk Reads") AS "Total Disk Reads",
       SUM("Total Buffer Gets") AS "Total Buffer Gets",
       SUM("Total Executions") AS "Total Executions",
       SUM("Total CPU Time") AS "Total CPU Time",
       SUM("Total Elapsed Time") AS "Total Elapsed Time"
FROM (
SELECT LAG(disk_reads, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id) as "Total Disk Reads" ,
       LAG(buffer_gets, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id) as "Total Buffer Gets",
       LAG(executions, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total Executions",
       LAG(cpu_time/1000000, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total CPU Time",
       LAG(elapsed_time/1000000, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total Elapsed Time"
FROM stats$sql_summary s
WHERE snap_id = ${endSnap} AND EXISTS
  (SELECT * FROM stats$sqltext t WHERE s.text_subset = t.text_subset AND s.old_hash_value = t.old_hash_value AND t.sql_text LIKE 'INSERT%')
) c
UNION ALL
SELECT 7 AS OrderCol,
       'Updates' AS "Summary",
       SUM("Total Disk Reads") AS "Total Disk Reads",
       SUM("Total Buffer Gets") AS "Total Buffer Gets",
       SUM("Total Executions") AS "Total Executions",
       SUM("Total CPU Time") AS "Total CPU Time",
       SUM("Total Elapsed Time") AS "Total Elapsed Time"
FROM (
SELECT LAG(disk_reads, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id) as "Total Disk Reads" ,
       LAG(buffer_gets, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id) as "Total Buffer Gets",
       LAG(executions, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total Executions",
       LAG(cpu_time/1000000, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total CPU Time",
       LAG(elapsed_time/1000000, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total Elapsed Time"
FROM stats$sql_summary s
WHERE snap_id = ${endSnap} AND EXISTS
(SELECT * FROM stats$sqltext t WHERE s.text_subset = t.text_subset AND s.old_hash_value = t.old_hash_value AND t.sql_text LIKE 'UPDATE%')
) c
UNION ALL
SELECT 8 AS OrderCol,
       'Deletes' AS "Summary",
       SUM("Total Disk Reads") AS "Total Disk Reads",
       SUM("Total Buffer Gets") AS "Total Buffer Gets",
       SUM("Total Executions") AS "Total Executions",
       SUM("Total CPU Time") AS "Total CPU Time",
       SUM("Total Elapsed Time") AS "Total Elapsed Time"
FROM (
SELECT LAG(disk_reads, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id) as "Total Disk Reads" ,
       LAG(buffer_gets, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id) as "Total Buffer Gets",
       LAG(executions, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total Executions",
       LAG(cpu_time/1000000, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total CPU Time",
       LAG(elapsed_time/1000000, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total Elapsed Time"
FROM stats$sql_summary s
WHERE snap_id = ${endSnap} AND EXISTS
  (SELECT * FROM stats$sqltext t WHERE s.text_subset = t.text_subset AND s.old_hash_value = t.old_hash_value AND t.sql_text LIKE 'DELETE%')
) c
UNION ALL
SELECT 9 AS OrderCol,
       'Hash Joins' AS "Summary",
       SUM("Total Disk Reads") AS "Total Disk Reads",
       SUM("Total Buffer Gets") AS "Total Buffer Gets",
       SUM("Total Executions") AS "Total Executions",
       SUM("Total CPU Time") AS "Total CPU Time",
       SUM("Total Elapsed Time") AS "Total Elapsed Time"
FROM (
SELECT LAG(disk_reads, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id) as "Total Disk Reads" ,
       LAG(buffer_gets, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id) as "Total Buffer Gets",
       LAG(executions, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total Executions",
       LAG(cpu_time/1000000, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total CPU Time",
       LAG(elapsed_time/1000000, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total Elapsed Time"
FROM stats$sql_summary s
WHERE snap_id = ${endSnap} AND EXISTS
  (SELECT * FROM stats$sql_plan p, stats$sql_plan_usage u
   WHERE s.old_hash_value = u.old_hash_value and u.plan_hash_value = p.plan_hash_value AND p.operation = 'HASH JOIN')
) c
UNION ALL
SELECT 10 AS OrderCol,
       'Merge Joins' AS "Summary",
       SUM("Total Disk Reads") AS "Total Disk Reads",
       SUM("Total Buffer Gets") AS "Total Buffer Gets",
       SUM("Total Executions") AS "Total Executions",
       SUM("Total CPU Time") AS "Total CPU Time",
       SUM("Total Elapsed Time") AS "Total Elapsed Time"
FROM (
SELECT LAG(disk_reads, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id) as "Total Disk Reads" ,
       LAG(buffer_gets, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id) as "Total Buffer Gets",
       LAG(executions, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total Executions",
       LAG(cpu_time/1000000, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total CPU Time",
       LAG(elapsed_time/1000000, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total Elapsed Time"
FROM stats$sql_summary s
WHERE snap_id = ${endSnap} AND EXISTS
  (SELECT * FROM stats$sql_plan p, stats$sql_plan_usage u
   WHERE s.old_hash_value = u.old_hash_value and u.plan_hash_value = p.plan_hash_value AND p.operation = 'MERGE JOIN')
) c
UNION ALL
SELECT 11 AS OrderCol,
       'Cartesian Joins' AS "Summary",
       SUM("Total Disk Reads") AS "Total Disk Reads",
       SUM("Total Buffer Gets") AS "Total Buffer Gets",
       SUM("Total Executions") AS "Total Executions",
       SUM("Total CPU Time") AS "Total CPU Time",
       SUM("Total Elapsed Time") AS "Total Elapsed Time"
FROM (
SELECT LAG(disk_reads, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id) as "Total Disk Reads" ,
       LAG(buffer_gets, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id) as "Total Buffer Gets",
       LAG(executions, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total Executions",
       LAG(cpu_time/1000000, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total CPU Time",
       LAG(elapsed_time/1000000, ${endSnap} - ${beginSnap}, 0) OVER(ORDER BY snap_id)  as "Total Elapsed Time"
FROM stats$sql_summary s
WHERE snap_id = ${endSnap} AND EXISTS
  (SELECT * FROM stats$sql_plan p, stats$sql_plan_usage u
   WHERE s.old_hash_value = u.old_hash_value and u.plan_hash_value = p.plan_hash_value AND p.operation = 'CARTESIAN JOIN')
) c
) c
ORDER BY 1
