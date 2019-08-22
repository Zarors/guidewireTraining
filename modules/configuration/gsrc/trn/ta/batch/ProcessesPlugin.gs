package trn.ta.batch

uses gw.plugin.processing.IProcessesPlugin
uses gw.processes.BatchProcess
uses trn.ta.batch.legalreport.FlagOverdueLegalReportsBatch

class ProcessesPlugin implements IProcessesPlugin {

  override function createBatchProcess(type : BatchProcessType, arguments : Object[]) : BatchProcess {
    switch(type) {
      case BatchProcessType.TC_FLAGOVERDUELEGALREPORTS:
          return new FlagOverdueLegalReportsBatch()
      default:
        return null
    }
  }
}



































































// CurrDev: File Reference is TA80_INTG140_BatchProcess_Lab.docx