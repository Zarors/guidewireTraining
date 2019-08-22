<%@ params (contactID : String, aBankAccount : BankAccount ) %>
contact,${contactID}
bankName,${aBankAccount.BankName}
routingNumber,${aBankAccount.RoutingNumber}
accountNumber,${aBankAccount.AccountNumber}
accountType,${aBankAccount.AccountType}
<% if (aBankAccount.AccountType == BankAccountType.TC_SAVINGS) { %>ageOfMessage,<@@ageOfMessageInSeconds@@><% } %>
