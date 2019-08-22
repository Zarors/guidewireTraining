-- rollback segment usage - useful information when testing staging table loader or upgrader
select segment_name, bytes, blocks, extents, initial_extent, next_extent, max_extents
from dba_segments where segment_type = 'ROLLBACK'
