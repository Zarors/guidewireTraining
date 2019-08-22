# Created by IntelliJ IDEA.
# User: sshi
# Date: Oct 22, 2007
# Time: 2:40:34 PM
# To change this template use File | Settings | File Templates.
#

class RandUtil

   $rand = ""

 def RandUtil.randAlphanumericCharacters(size)
     chars = ("a".."z").to_a + ("A".."Z").to_a + ("0".."9").to_a
     1.upto(size) { |i| $rand << chars[rand(chars.length - 1)] }
         
  return  $rand
 end

 def RandUtil.randrandDigits(size)
     chars = ("0".."9").to_a
     1.upto(size) { |i| $rand << chars[rand(chars.length - 1)] }

  return  $rand
 end

 def RandUtil.randLetters(size)
     chars = ("a".."z").to_a + ("A".."Z").to_a
     1.upto(size) { |i| $rand << chars[rand(chars.length - 1)] }

  return  $rand
 end

 def RandUtil.randLettersLower(size)
     chars = ("a".."z").to_a 
     1.upto(size) { |i| $rand << chars[rand(chars.length - 1)] }

  return  $rand
 end

  def RandUtil.randLettersUpper(size)
     chars = ("A".."Z").to_a 
     1.upto(size) { |i| $rand << chars[rand(chars.length - 1)] }

  return  $rand
  end

end