package gw.api.database

uses java.lang.NumberFormatException
uses java.lang.Long
uses java.lang.Exception
uses java.lang.RuntimeException

uses com.guidewire.pl.system.dependency.PLDependencies
uses com.guidewire.pl.system.service.RemoteQueryService
uses gw.config.CommonServices
uses gw.lang.reflect.TypeSystem

enhancement GWQueriesEnhancement: gw.api.database.Queries {
  @Deprecated("Please use Queries#findByPublicId() or Bundle#loadBean().")
  static reified function findByIdOrPublicId<T>(type: Type<T>, id: long): T {
    return findByIdOrPublicId<T>(id as String)
  }

  @Deprecated("Please use Queries#findByPublicId() or Bundle#loadBean().")
  static reified function findByIdOrPublicId<T>(type: Type<T>, strLocalOrPublicId: String): T {
    return findByIdOrPublicId<T>(strLocalOrPublicId)
  }

  @Deprecated("Please use Queries#findByPublicId() or Bundle#loadBean().")
  static reified function findByIdOrPublicId<T>(id: long): T {
    return findByIdOrPublicId<T>(id as String)
  }

  @Deprecated("Please use Queries#findByPublicId() or Bundle#loadBean().")
  static reified function findByIdOrPublicId<T>(strLocalOrPublicId: String): T {
    var lId: long
    try {
      lId = Long.parseLong( strLocalOrPublicId );
    } catch (nfe: NumberFormatException) {
      try {
        lId = CommonServices.getEntityAccess().getHashedEntityId(strLocalOrPublicId, T);
      } catch (e: Exception) {
        throw new RuntimeException("No entity with id, " + strLocalOrPublicId + ", found for ObjectLiteral of type, " +
            TypeSystem.getUnqualifiedClassName(T));
      }
    }
    return PLDependencies.getCommonDependencies().getEntitySource().loadBean(
          (PLDependencies.getServiceFactory().getService( RemoteQueryService ) as RemoteQueryService).loadBean( T.Type.Name, lId ).Id ) as T
  }

  @Deprecated("Please use Queries#findByPublicId() or Bundle#loadBean().")
  static reified function findByIdOrPublicId<T extends Object>(type: Type<T>, key: gw.pl.persistence.core.Key): T {
    return findByIdOrPublicId(type, key.getValue())
  }
}
