Attribute VB_Name = "ExportMacros"
Function save_as_csv(ByVal theSheet As Worksheet)
Attribute save_as_csv.VB_Description = "Saves current tab to a csv file with the same name as the tab."
Attribute save_as_csv.VB_ProcData.VB_Invoke_Func = " \n14"
'
' Saves current tab to a csv file with the same name as the tab.
'
    Dim ExportDir, CSVFile As String
    Let ExportDir = ActiveWorkbook.Path
    Let CSVFile = ExportDir + "\" + theSheet.Name + ".csv"

    'Suppress warning dialogs
    Application.DisplayAlerts = False
    
    'Save as CSV
    theSheet.SaveAs Filename:=CSVFile, _
        FileFormat:=xlCSV, CreateBackup:=False
        
End Function


Sub export_sheet_to_csv()
'
' Saves current file, calls sub to save 1 sheet as CSV, saves back in XLS format
'
    Dim OrigFile As String
    Let OrigFile = ActiveWorkbook.FullName
    
    'Suppress warning dialogs
    Application.DisplayAlerts = False
    
    'Save before changing anything
    If Not (ActiveWorkbook.Saved) Then ActiveWorkbook.Save
    
    'Save as CSV
    save_as_csv ActiveSheet

    'Save back as XLS
    ActiveWorkbook.SaveAs Filename:=OrigFile, _
        FileFormat:=xlNormal, CreateBackup:=False, _
        ConflictResolution:=xlLocalSessionChanges

End Sub

Sub export_all_sheets_to_csv()
'
' Saves current file, calls sub to save each sheet in workbook as CSV, saves back in XLS format, reactivates original sheet
'
    Dim OrigFile As String
    Let OrigFile = ActiveWorkbook.FullName
    
    Dim currSheet As Worksheet
    Set currSheet = ActiveSheet
    
    'Suppress warning dialogs
    Application.DisplayAlerts = False
    
    'Save before changing anything
    If Not (ActiveWorkbook.Saved) Then ActiveWorkbook.Save
    
    'Save as CSV
    For Each theSheet In ActiveWorkbook.Worksheets
      If Not (Mid(theSheet.Name, 1, 1) = "#") Then
        save_as_csv (theSheet)
      End If
    Next

    'Save back as XLS
    ActiveWorkbook.SaveAs Filename:=OrigFile, _
        FileFormat:=xlNormal, CreateBackup:=False, _
        ConflictResolution:=xlLocalSessionChanges

    'Reactivate the original sheet.  Needed?
    
End Sub


