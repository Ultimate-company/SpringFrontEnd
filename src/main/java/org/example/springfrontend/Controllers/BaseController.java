package org.example.springfrontend.Controllers;

import jakarta.servlet.http.HttpSession;
import org.example.FactoryExtensions;
import org.example.Models.CommunicationModels.CarrierModels.Permissions;
import org.example.Models.CommunicationModels.CentralModels.User;
import org.example.Models.CommunicationModels.CentralModels.Carrier;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.HashMap;
import java.util.Map;

@Controller
public class BaseController {

    @Autowired
    private Environment environment;

    public FactoryExtensions apiTranslator() {
        String profile = environment.getActiveProfiles().length > 0 ? environment.getActiveProfiles()[0] : "default";
        String apiUrl = "";
        switch (profile) {
            case "development":
                apiUrl = "http://host.docker.internal:8080/api";
                break;
            case "localhost":
                apiUrl = "http://localhost:8081/api";
                break;
            case "staging":
                break;
            case "uat":
                break;
            case "main":
                break;
        }
        return new FactoryExtensions(StringUtils.hasText(getApiToken()) ? getApiToken() : null,
                getCurrentUser() != null ? getCurrentUser().getUserId() : null,
                getCurrentCarrier() != null ? getCurrentCarrier().getCarrierId() : null,
                apiUrl);
    }

    public Permissions getPermission() {
        HttpSession httpSession = getCurrentSession();
        if (httpSession == null ||
                httpSession.getAttribute("Permission") == null ||
                httpSession.getAttribute("Permission").equals("")) {
            return null;
        } else {
            return (Permissions) httpSession.getAttribute("Permission");
        }
    }

    protected void setPermission(Permissions value) {
        HttpSession httpSession = getCurrentSession();
        if(httpSession != null){
            httpSession.setAttribute("Permission", value);
        }
    }

    public String getApiToken() {
        HttpSession httpSession = getCurrentSession();
        if (httpSession == null ||
                httpSession.getAttribute("ApiToken") == null ||
                httpSession.getAttribute("ApiToken").equals("")) {
            return null;
        } else {
            return (String) httpSession.getAttribute("ApiToken");
        }
    }

    public void setApiToken(String value) {
        HttpSession httpSession = getCurrentSession();
        if(httpSession != null) {
            httpSession.setAttribute("ApiToken", value);
        }
    }

    public User getCurrentUser() {
        HttpSession httpSession = getCurrentSession();
        if (httpSession == null ||
                httpSession.getAttribute("CurrentUser") == null ||
                httpSession.getAttribute("CurrentUser").equals("")) {
            return null;
        } else {
            User currentUser = (User) httpSession.getAttribute("CurrentUser");
            if (currentUser.isGuest()) {
                return null;
            } else {
                return currentUser;
            }
        }
    }

    public void setCurrentUser(User value) {
        HttpSession httpSession = getCurrentSession();
        if(httpSession != null){
            httpSession.setAttribute("CurrentUser", value);
        }
    }

    public Carrier getCurrentCarrier() {
        HttpSession httpSession = getCurrentSession();
        if (httpSession == null ||
                httpSession.getAttribute("CurrentCarrier") == null ||
                httpSession.getAttribute("CurrentCarrier").equals("")) {
            return null;
        } else {
            return (Carrier) httpSession.getAttribute("CurrentCarrier");
        }
    }

    public void setCurrentCarrier(Carrier value) {
        HttpSession httpSession = getCurrentSession();
        if(httpSession != null){
            httpSession.setAttribute("CurrentCarrier", value);
        }
    }

    protected HttpSession getCurrentSession() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            return attributes.getRequest().getSession();
        }
        return null;
    }

    protected void resetSession() {
        // Get the current session
        HttpSession currentSession = getCurrentSession();

        // Invalidate the current session (if it exists)
        if (currentSession != null) {
            currentSession.invalidate();
        }
    }

    public Map<String, String> getFlash() {
        HttpSession httpSession = getCurrentSession();
        if (httpSession != null && httpSession.getAttribute("Flash") == null) {
            httpSession.setAttribute("Flash", new HashMap<String, String>());
        }
        return (Map<String, String>) httpSession.getAttribute("Flash");
    }

    public void setFlash(Map<String, String> flash) {
        HttpSession httpSession = getCurrentSession();
        if(httpSession != null){
            httpSession.setAttribute("Flash", flash);
        }
    }
}