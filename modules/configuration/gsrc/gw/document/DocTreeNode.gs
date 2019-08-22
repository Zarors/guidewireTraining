package gw.document
uses gw.api.tree.TreeNode
uses java.util.Map
uses java.util.TreeMap
uses java.lang.UnsupportedOperationException
uses java.lang.Iterable
uses gw.lang.reflect.IPropertyInfo
uses java.lang.StringBuilder
uses java.util.List

/** This class will permit creating a tree out of a series of documents.
 * 
 */
@Export
class DocTreeNode implements TreeNode {
  var _name : String as Desc
  var _children : Map<String, DocTreeNode> as ChildrenMap = new TreeMap<String, DocTreeNode>()
  var _doc : Document as Document
  var _expanded : boolean as Expanded


  /** And empty unnamed DocTreeNode, i.e., root node
   */
  construct() {}

  /** constructs a non root, non leaf node
   * @param token the value for the name of this row
   * @param parent the node to add this node too
   */
  construct(token : String, parent : DocTreeNode) { 
    _name = token
    parent.ChildrenMap.put(token, this) 
  }

  /** creates a leaf node for a specified document
   * @param inDoc the document to set this leaf node
   * @param parent the node to add this node too
  */
  construct(inDoc : Document, parent : DocTreeNode) { 
    this(inDoc.Name, parent)
    _doc = inDoc 
  }

  /** given a document query, produce the tree.  The block
   * will provide the algorythm to create the path
   *
   * @param docs the documents 
   * @param block the method for extracting the path from the document
   */
  construct(docs : Iterable<Document>, createPath(doc : Document) : String[]) {
    this.Expanded = true;
    for (doc in docs) {
      var path = createPath(doc)
      var docNode = new DocTreeNode(doc, findOrAdd(path))
    }
  }
  
  /** Look for the node with the given name and return it.  If
   * not found create a new node
   *
   * @param token the name to look for
   * @return the DocTreeNode 
   */
  private function findOrAdd(token : String) : DocTreeNode {
    var row = _children.get(token)
    return (row == null) ? new DocTreeNode(token, this) : row
  }
  
  /** Look for the node with the given name and return it.  If
   * not found create a new node
   *
   * @param tokens the path to look for
   * @return the DocTreeNode 
   */
  private function findOrAdd(tokens : String[]) : DocTreeNode {
    if (tokens.IsEmpty) {
      return this
    }
    var work = this;
    for (token in tokens) {
      work = work.findOrAdd(token)
    }
    return work;
  }
  
  /** This uses itself as the data and the model, so this just returns
   * itself.
   */
  override property get Data() : Object { 
    return this 
  }
  
  /** not really a model, but the real value
   * 
   */
  override property set Data(_proxy_arg_value : Object) {
    throw new UnsupportedOperationException("This should not be called")
  }

  /** If I have a document, I am leaf, also there will be no children
   * 
   */
  override property get Leaf() : boolean { 
    return _children.Empty 
  }
  
  /** the number of children
   * 
   */
  override property get NumChildren() : int { 
    return _children.Count 
  }
  
  /** get a specific child
   * 
   */
  override function getChild(p0 : int) : TreeNode { 
    return _children.Values.toList().get(p0) 
  }
  
  /** toggle between expanded or collapsed
   * 
   */
  override function toggle() { 
    _expanded = !_expanded 
  }
  
  /** This will get the children as a list
   * 
   */
  override property get Children() : List<TreeNode> { 
    return _children.Values.toList() 
  }
  
  override function toString() : String {
    return "DTN:" + Desc + " " + (Document == null ? Children : "Doc");
  }

  static function createPath(doc : Document, byColumns : IPropertyInfo[]) : String[] {
    var path = new StringBuilder()
    for (byColumn in byColumns) {
      if (path.length() > 0) { path.append("/");  }
      if (byColumn == Document#DateCreated.PropertyInfo) {
        if (doc.DateCreated == null) {
          path.append("null/null/null")
        }
        else {
          path.append(doc.DateCreated.format("yyyy/M/d"))
        }
      }
      else if (byColumn == Document#Name.PropertyInfo) { // create path from directories, leave last token off
        var pos = doc.Name.lastIndexOf("/")
        if (pos != -1) {
          path.append(doc.Name.substring(0, pos))
        }
      }
      else {
        path.append(byColumn.Accessor.getValue(doc)) // want the null or customer can rewrite
      }
    }
    return path.length() == 0 ? {} : path.toString().split("/");
  }
}
