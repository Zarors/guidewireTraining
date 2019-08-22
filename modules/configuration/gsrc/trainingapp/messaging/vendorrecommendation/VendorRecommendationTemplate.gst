<%@ params (contactID : String, evaluations : VendorEvaluation[] ) %>
VendorID: ${contactID}
SenderRefID: <@@senderRefID@@>
Number of evaluations: ${evaluations.length}
<% for ( anEvaluation  in evaluations index i ) { %>
    Evaluation #${i+1}
    Evaluator: ${anEvaluation.Evaluator}
    Date: ${anEvaluation.EvaluationDate}
    Score: ${anEvaluation.TotalScore}
<% } %>
