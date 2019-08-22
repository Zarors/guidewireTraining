package gw.api.contact

uses gw.entity.IEntityType
uses gw.pl.persistence.core.Key
uses gw.util.Pair

/**
 * This class is the default implementation of the ABContactPurgeMethodsImpl interface,
 * which provides support for purging any extension entities that point to ABContact.
 */
@Export
public class ABContactPurgeMethodsImpl implements ABContactPurgeMethods {

  /**
   * Reference to the ABContact currently being purged.
   */
  private var _contact: ABContact as readonly ThisContact

  construct(contact: ABContact) {
    _contact = contact
  }

  /**
   * <p>Implement this property to identify the IDs of beans that are linked to this
   * ABContact and should be purged along with the ABContact, but are outside the contact graph.
   * The internal purge logic uses the contact graph to decide what beans are part of the contact,
   * but relies on this property for information about beans outside the graph but that should
   * still be deleted during purge. The order of the returned List determines the order in
   * which the beans will be deleted. The ID of the ABContact must also be included in the identified
   * beans, and it must be the only ABContact; the other beans in the result will normally be
   * extension entities.
   * </p><p>
   * Important implementation note: as a contact is being purged, this property will be evaluated twice.
   * First, when the contact is being marked as ready for purge, the beans it identifies will be
   * retired, indicating that they are ready for purge. Then, it will be evaluated again to determine
   * the beans to actually delete from the database. Since the beans will already be retired during
   * this second execution, this property must be implemented to find the IDs of both retired and
   * non-retired beans. You may wish to use the Query API and call Query.withFindRetired(true).</p>
   *
   * @return a List of the IDs for the beans to delete (including the ABContact itself), grouped by type and
   * in the order that they should be deleted; this is actually a list of Pairs, where each
   * Pair contains a type and the IDs of the beans of that type to be deleted
   */
  public override property get NonGraphBeansToPurge(): List<Pair<IEntityType, List<Key>>> {
    return Collections.emptyList();
  }

}