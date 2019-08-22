require 'watir'
END {				# close ie and adobe at completion of the tests
  $ie.close if $ie
  Watir::IE.quit 
  kill_adobe
}

include Watir
require 'test/unit'
require 'test/unit/ui/console/testrunner'
require 'watir/testUnitAddons'
require 'watir/testcase'
require 'win32ole'
require 'win32/process'

def start_ie
  $ie = Watir::IE.new
  $ie.set_fast_speed
  $ie.send_keys('{tab}')
end

def kill_adobe
   atx = WIN32OLE.new('AutoItX3.Control')
   atx.Opt("WinTitleMatchMode", 2)	
   $title = "Adobe"
   if atx.WinExists($title)
      $value =  atx.WinGetProcess($title)
	  Process.kill('KILL',$value.to_i)
   end
end

$html = ARGV[0]
start_ie