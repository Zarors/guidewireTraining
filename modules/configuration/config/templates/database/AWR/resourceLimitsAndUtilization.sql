select resource_name,
  case snap_id when ${beginSnap} then 'start' else 'end' end as "start/end",
  current_utilization, max_utilization, initial_allocation, limit_value
from dba_hist_resource_limit
where snap_id in (${beginSnap}, ${endSnap})
order by resource_name