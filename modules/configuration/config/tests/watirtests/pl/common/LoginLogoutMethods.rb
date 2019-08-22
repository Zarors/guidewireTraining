class LoginLogoutMethods

   $login_username = "Login:LoginScreen:LoginDV:username"
   $login_password = "Login:LoginScreen:LoginDV:password"
   $login_submit =  "Login:LoginScreen:LoginDV:submit"
   $logout_button = "TabBar:LogoutTabBarLink"

   public
	
   def LoginLogoutMethods.login( user )
     $ie.goto($html + "/Login.do")

     if $ie.frame(:name, "top_frame").link(:id, $logout_button).exists?
		logout
	 end
	 
     wait_until {$ie.frame(:name, "top_frame").button(:id, $login_submit).exists?}
     $ie.frame(:name, "top_frame").text_field(:id, $login_username).set(user)
     $ie.frame(:name, "top_frame").text_field(:id, $login_password).set("gw")
     $ie.frame(:name, "top_frame").button(:id, $login_submit).click
     wait_until {$ie.frame(:name, "top_frame").link(:id, "TabBar:DesktopTab_arrow").exists?}
   end 	

   def LoginLogoutMethods.logout()
     $ie.frame(:name, "top_frame").link(:id, $logout_button).click
   end

end
