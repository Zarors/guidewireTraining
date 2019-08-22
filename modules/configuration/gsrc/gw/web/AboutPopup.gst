<%-- This template is used to generate the HTML in the application "About" popup --%>
<% uses gw.api.locale.DisplayKey %>
<% uses gw.api.web.WebUtil %>
<% uses gw.api.system.PLConfigParameters %>
<%@ params(writer: java.io.Writer, info: gw.api.extension.AboutPopupWriter.Info) %>
<html>
  <head>
    <title>${DisplayKey.get("Java.AboutDialog.Title")}</title>
    <base href="<%writer.write(WebUtil.getResourcesPath())%>">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="Cache-Control" content="no-cache">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <style>
      .about-body {
        background-color: #ffffff;
        margin: auto;
      }
      .about-body a:link, .about-body a:visited, .about-body a:active {
        color: #0000ff;
      }
      .about-text {
        font-family: Courier New, Courier, monotype;
        font-size: 11px;
        font-weight: normal;
        color: #47637e;
        z-index: 10;
        margin-left: 20px;
      }
      .preview-text {
        font-family: Courier New, Courier, monotype;
        font-size: 18px;
        font-weight: bold;
        text-align: center;
        color: #47637e;
        z-index: 20;
      }
    </style>
  </head>
  <body class="about-body">
    <img src="<%writer.write(WebUtil.getResourcesPath())%>/img/app/about-splash.png">
    <% if (info.ServerVersion.AppVersion.contains("pr")) { %>
    <div class="preview-text">${DisplayKey.get("Java.AboutDialog.PreviewWarning")}<br></div>
    <% } %>
    <div class="about-text">
      ${DisplayKey.get("Java.AboutDialog.AppVersion")} ${info.ServerVersion.AppVersion}<br>
      ${DisplayKey.get("Java.AboutDialog.PlatformVersion")} ${info.ServerVersion.PlatformVersion}<br>
      ${DisplayKey.get("Java.AboutDialog.SchemaVersion")} ${info.ServerVersion.SchemaVersion}<br>
      ${DisplayKey.get("Java.AboutDialog.CustomerVersion")} ${info.ServerVersion.CustomerVersion}<br>
      ${DisplayKey.get("Java.AboutDialog.ServerInstance")} ${info.ServerId}&nbsp;&nbsp;
      ${DisplayKey.get("Java.AboutDialog.ConfigEnv")} ${info.Env}<br>
      <%if (PLConfigParameters.ConfigurationServiceEnabled.Value) {%>
      ${DisplayKey.get("Java.AboutDialog.AdminDataVersion")} ${info.AdminDataVersion}<br>
      ${DisplayKey.get("Java.AboutDialog.AdminDataImportDate")} ${info.AdminDataImportDateString}<br>
      <% } %>
    </div>
  </body>
</html>
