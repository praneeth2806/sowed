document.addEventListener("DOMContentLoaded", function() {
    // Initialize Keycloak
    const keycloak = new Keycloak({
         url:"http://172.25.212.86:8181",
        //url: 'http://localhost:8080',
        realm: 'myRealm',
        clientId: 'testclientid',
        enablePersistent:true
 
    });
 
    const outputTextarea = document.getElementById('output');
 
    function logToTextarea(message) {
        const now = new Date();
        const timestamp = now.toLocaleString();
        outputTextarea.value += `[${timestamp}] ${message}\n`;
    }
// Retrieve tokens from sessionStorage
const storedToken = sessionStorage.getItem("keycloak-token");
const storedRefreshToken = sessionStorage.getItem("keycloak-refresh-token");
    keycloak.init({
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        checkLoginIframe: false,
        enableLogging: true,
        timeSkew: 5, // Allow 5-second clock skew
        // nonce: null,
        Storage:sessionStorage,
        // token: storedToken,  // Use stored token
        // refreshToken: storedRefreshToken  // Use stored refresh token
    }).then(function(authenticated) {
        logToTextarea(authenticated ? 'User is authenticated' : 'User is not authenticated');
       if(authenticated)
       {
        sessionStorage.setItem("keycloak-token", keycloak.token);
        sessionStorage.setItem("keycloak-refresh-token", keycloak.refreshToken);
       }
       else{
        sessionStorage.clear()
       }
        document.getElementById('loginBtn').addEventListener('click', function() {
            logToTextarea('Login button clicked');
            keycloak.login();
           
        });
 
        document.getElementById('logoutBtn').addEventListener('click', function() {
            logToTextarea('Logout button clicked');
            keycloak.logout();
            sessionStorage.clear()
        });
 
        // document.getElementById('isLoggedInBtn').addEventListener('click', function() {
        //     const isLoggedInMessage = keycloak.authenticated ? 'User is logged in' : 'User is not logged in';
        //     logToTextarea('Is Logged In button clicked: ' + isLoggedInMessage);
        //     alert(isLoggedInMessage);
        // });
 
        // document.getElementById('accessTokenBtn').addEventListener('click', function() {
        //     if (keycloak.authenticated) {
        //         logToTextarea('Access Token button clicked: ' + keycloak.token);
        //         alert('Access Token: ' + keycloak.token);
        //     } else {
        //         const notLoggedInMessage = 'User is not logged in';
        //         logToTextarea('Access Token button clicked: ' + notLoggedInMessage);
        //         alert(notLoggedInMessage);
        //     }
        // });
 
        // document.getElementById('showParsedTokenBtn').addEventListener('click', function() {
        //     if (keycloak.authenticated) {
        //         const parsedToken = keycloak.tokenParsed;
        //         logToTextarea('Show Parsed Access Token button clicked: ' + JSON.stringify(parsedToken, null, 2));
        //         alert('Parsed Access Token: ' + JSON.stringify(parsedToken, null, 2));
        //     } else {
        //         const notLoggedInMessage = 'User is not logged in';
        //         logToTextarea('Show Parsed Access Token button clicked: ' + notLoggedInMessage);
        //         alert(notLoggedInMessage);
        //     }
        // });
    }).catch(function(e) {
        console.log(e)
        console.error('Failed to initialize',e);
    });
 
   function refreshToken() {
        keycloak.updateToken(30)  // Refresh if token expires in the next 30 seconds
            .then((refreshed) => {
                if (refreshed) {
                    console.log("Token refreshed:", keycloak.token);
                sessionStorage.setItem("keycloak-token", keycloak.token);
              sessionStorage.setItem("keycloak-refresh-token", keycloak.refreshToken);
            } else {
                console.log("Token still valid, no need to refresh.");
            }
        })
        .catch((error) => {
            console.error("Failed to refresh token:", error);
        });
}
 
// Call every 30 seconds
setInterval(refreshToken, 30000);
// console.log(window.location.hash)
// if (window.location.hash.includes("iss=")) {
//     console.log(window.location.pathname)
//   history.replaceState(null, "", window.location.pathname);
// }
});
 
 
