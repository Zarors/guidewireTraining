SELECT owner, table_name,
       sum(logical_reads) as "Logical Reads", sum(logical_reads_ratio) as "Logical Reads Ratio",
       sum(physical_reads) as "Physical Reads", sum(physical_reads_ratio) as "Physical Reads Ratio",
       sum(physical_writes) as "Physical Writes", sum(physical_writes_ratio) as "Physical Writes Ratio"
FROM (
select n.owner,
       case when n.object_type = 'TABLE' then n.object_name
            when n.object_type = 'INDEX' then (SELECT table_name from user_indexes WHERE index_name = n.object_name)
            when n.object_type = 'LOB' then (SELECT table_name from user_lobs WHERE segment_name = n.object_name)
                    		       else 'N/A' end as Table_name,
       n.object_name, n.object_type,
       r.logical_reads,
       round(r.logical_reads_ratio * 100, 2) logical_reads_ratio,
       r.physical_reads,
       round(r.physical_reads_ratio * 100, 2) physical_reads_ratio,
       r.physical_writes,
       round(r.physical_writes_ratio * 100, 2) physical_writes_ratio
  from stats$seg_stat_obj n,
       (select *
        from (select e.dataobj#,
                     e.obj#,
                     e.dbid,
                     e.logical_reads - nvl(b.logical_reads, 0) logical_reads,
                     ratio_to_report(e.logical_reads - nvl(b.logical_reads, 0)) over () logical_reads_ratio,
                     e.physical_reads - nvl(b.physical_reads, 0) physical_reads,
                     ratio_to_report(e.physical_reads - nvl(b.physical_reads, 0)) over () physical_reads_ratio,
                     e.physical_writes - nvl(b.physical_writes, 0) physical_writes,
                     ratio_to_report(e.physical_writes - nvl(b.physical_writes, 0)) over () physical_writes_ratio
              from stats$seg_stat e, stats$seg_stat b
                 where b.snap_id (+) = ${beginSnap} and e.snap_id = ${endSnap} and
                       e.obj# = b.obj# (+) and
                       e.dataobj# = b.dataobj# (+) and
		       (e.logical_reads - nvl(b.logical_reads, 0)  > 0 or
                        e.physical_reads - nvl(b.physical_reads, 0)  > 0 or
                        e.physical_writes - nvl(b.physical_writes, 0)  > 0)
                 order by logical_reads desc) d
          where rownum <= 100) r
 where n.dataobj# = r.dataobj# and
       n.obj#     = r.obj# and
       n.dbid     = r.dbid and
       n.owner = '${schemaName}'
) c
group by owner, table_name
order by 3 desc
