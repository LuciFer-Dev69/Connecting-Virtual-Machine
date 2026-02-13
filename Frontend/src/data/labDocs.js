export const LAB_DOCS = {
    "1": {
        title: "Host Discovery",
        sections: [
            { type: "text", content: "When we need to conduct an internal penetration test for the entire network of a company, for example, then we should, first of all, get an overview of which systems are online that we can work with. To actively discover such systems on the network, we can use various Nmap host discovery options. There are many options Nmap provides to determine whether our target is alive or not. The most effective host discovery method is to use ICMP echo requests, which we will look into." },
            { type: "text", content: "It is always recommended to store every single scan. This can later be used for comparison, documentation, and reporting. After all, different tools may produce different results. Therefore it can be beneficial to distinguish which tool produces which results." },
            { type: "subtitle", content: "Scan Network Range" },
            {
                type: "terminal",
                command: "sudo nmap 10.129.2.0/24 -sn -oA tnet | grep for | cut -d\" \" -f5",
                output: "10.129.2.4\n10.129.2.10\n10.129.2.11\n10.129.2.18\n10.129.2.19\n10.129.2.20\n10.129.2.28"
            },
            {
                type: "table",
                columns: ["Scanning Options", "Description"],
                rows: [
                    ["10.129.2.0/24", "Target network range."],
                    ["-sn", "Disables port scanning."],
                    ["-oA tnet", "Stores the results in all formats starting with the name 'tnet'."]
                ]
            },
            { type: "text", content: "This scanning method works only if the firewalls of the hosts allow it. Otherwise, we can use other scanning techniques to find out if the hosts are active or not. We will take a closer look at these techniques in \"Firewall and IDS Evasion\"." },
            { type: "subtitle", content: "Scan IP List" },
            { type: "text", content: "During an internal penetration test, it is not uncommon for us to be provided with an IP list with the hosts we need to test. Nmap also gives us the option of working with lists and reading the hosts from this list instead of manually defining or typing them in." },
            {
                type: "terminal",
                command: "cat hosts.lst",
                output: "10.129.2.4\n10.129.2.10\n10.129.2.11\n10.129.2.18\n10.129.2.19\n10.129.2.20\n10.129.2.28"
            },
            { type: "text", content: "If we use the same scanning technique on the predefined list, the command will look like this:" },
            {
                type: "terminal",
                command: "sudo nmap -sn -oA tnet -iL hosts.lst | grep for | cut -d\" \" -f5",
                output: "10.129.2.18\n10.129.2.19\n10.129.2.20"
            },
            {
                type: "table",
                columns: ["Scanning Options", "Description"],
                rows: [
                    ["-sn", "Disables port scanning."],
                    ["-oA tnet", "Stores the results in all formats starting with the name 'tnet'."],
                    ["-iL", "Performs defined scans against targets in provided 'hosts.lst' list."]
                ]
            },
            { type: "text", content: "In this example, we see that only 3 of 7 hosts are active. Remember, this may mean that the other hosts ignore the default ICMP echo requests because of their firewall configurations. Since Nmap does not receive a response, it marks those hosts as inactive." },
            { type: "subtitle", content: "Scan Multiple IPs" },
            { type: "text", content: "It can also happen that we only need to scan a small part of a network. An alternative to the method we used last time is to specify multiple IP addresses." },
            {
                type: "terminal",
                command: "sudo nmap -sn -oA tnet 10.129.2.18 10.129.2.19 10.129.2.20| grep for | cut -d\" \" -f5",
                output: "10.129.2.18\n10.129.2.19\n10.129.2.20"
            },
            { type: "text", content: "If these IP addresses are next to each other, we can also define the range in the respective octet." },
            {
                type: "terminal",
                command: "sudo nmap -sn -oA tnet 10.129.2.18-20| grep for | cut -d\" \" -f5",
                output: "10.129.2.18\n10.129.2.19\n10.129.2.20"
            },
            { type: "subtitle", content: "Scan Single IP" },
            { type: "text", content: "Before we scan a single host for open ports and its services, we first have to determine if it is alive or not. For this, we can use the same method as before." },
            {
                type: "terminal",
                command: "sudo nmap 10.129.2.18 -sn -oA host",
                output: "Starting Nmap 7.80 ( https://nmap.org ) at 2020-06-14 23:59 CEST\nNmap scan report for 10.129.2.18\nHost is up (0.087s latency).\nMAC Address: DE:AD:00:00:BE:EF\nNmap done: 1 IP address (1 host up) scanned in 0.11 seconds"
            },
            {
                type: "table",
                columns: ["Scanning Options", "Description"],
                rows: [
                    ["10.129.2.18", "Performs defined scans against the target."],
                    ["-sn", "Disables port scanning."],
                    ["-oA host", "Stores the results in all formats starting with the name 'host'."]
                ]
            },
            { type: "text", content: "If we disable port scan (-sn), Nmap automatically ping scan with ICMP Echo Requests (-PE). Once such a request is sent, we usually expect an ICMP reply if the pinging host is alive. The more interesting fact is that our previous scans did not do that because before Nmap could send an ICMP echo request, it would send an ARP ping resulting in an ARP reply. We can confirm this with the \"--packet-trace\" option. To ensure that ICMP echo requests are sent, we also define the option (-PE) for this." },
            {
                type: "terminal",
                command: "sudo nmap 10.129.2.18 -sn -oA host -PE --packet-trace",
                output: "Starting Nmap 7.80 ( https://nmap.org ) at 2020-06-15 00:08 CEST\nSENT (0.0074s) ARP who-has 10.129.2.18 tell 10.10.14.2\nRCVD (0.0309s) ARP reply 10.129.2.18 is-at DE:AD:00:00:BE:EF\nNmap scan report for 10.129.2.18\nHost is up (0.023s latency).\nMAC Address: DE:AD:00:00:BE:EF\nNmap done: 1 IP address (1 host up) scanned in 0.05 seconds"
            },
            {
                type: "table",
                columns: ["Scanning Options", "Description"],
                rows: [
                    ["10.129.2.18", "Performs defined scans against the target."],
                    ["-sn", "Disables port scanning."],
                    ["-oA host", "Stores the results in all formats starting with the name 'host'."],
                    ["-PE", "Performs the ping scan by using 'ICMP Echo requests' against the target."],
                    ["--packet-trace", "Shows all packets sent and received"]
                ]
            }
        ]
    },
    "2": {
        title: "Version Detection",
        sections: [
            { type: "text", content: "After identifying which hosts are alive on the network, the next step in a penetration test is service enumeration. Service enumeration helps us determine what services are running on open ports and which versions of those services are in use. This information is critical, as outdated or vulnerable service versions may be exploitable." },
            { type: "text", content: "Nmap provides a powerful version detection feature using the -sV option. This allows Nmap to probe open ports and extract banner information to identify service names, versions, and sometimes the operating system or software details." },
            { type: "text", content: "As with all scanning phases, it is recommended to store all scan results for later analysis, reporting, and comparison." },
            { type: "subtitle", content: "Scan Single Host for Version Detection" },
            { type: "text", content: "Once a host is confirmed to be alive, we can scan it for open ports and running services along with their versions." },
            {
                type: "terminal",
                command: "sudo nmap -sV 10.129.2.18 -oA version_scan",
                output: "PORT     STATE SERVICE VERSION\n21/tcp   open  ftp     vsftpd 3.0.3\n22/tcp   open  ssh     OpenSSH 7.6p1 Ubuntu 4\n80/tcp   open  http    Apache httpd 2.4.29"
            },
            {
                type: "table",
                columns: ["Option", "Description"],
                rows: [
                    ["-sV", "Enables service and version detection."],
                    ["10.129.2.18", "Target IP address."],
                    ["-oA version_scan", "Stores results in all formats starting with the name version_scan."]
                ]
            },
            { type: "text", content: "This scan allows us to identify running services and their versions, which can later be cross-checked against known vulnerabilities." },
            { type: "subtitle", content: "Scan Multiple Hosts for Version Detection" },
            { type: "text", content: "If multiple hosts are active, we can perform version detection against all of them at once." },
            {
                type: "terminal",
                command: "sudo nmap -sV 10.129.2.18 10.129.2.19 10.129.2.20 -oA version_multi",
                output: "Scanning 3 hosts...\n10.129.2.18: 21/ftp, 22/ssh, 80/http\n10.129.2.19: 22/ssh, 80/http, 443/https\n10.129.2.20: 80/http, 8080/http-proxy"
            },
            { type: "text", content: "This approach is useful when targeting a small set of known systems within the network." },
            { type: "subtitle", content: "Scan Network Range for Version Detection" },
            { type: "text", content: "We can also perform version detection across an entire subnet. However, this method is time-consuming and should be used carefully, especially in production environments." },
            {
                type: "terminal",
                command: "sudo nmap -sV 10.129.2.0/24 -oA version_range",
                output: "Starting Nmap 7.80...\nNmap scan report for 10.129.2.18\nHost is up.\nPORT   STATE SERVICE VERSION\n80/tcp open  http    Apache httpd 2.4.29\n...\nNmap done: 256 IP addresses (7 hosts up) scanned"
            },
            {
                type: "table",
                columns: ["Option", "Description"],
                rows: [
                    ["10.129.2.0/24", "Target network range."],
                    ["-sV", "Enables version detection."],
                    ["-oA version_range", "Saves results in all output formats."]
                ]
            },
            { type: "subtitle", content: "Increase Version Detection Accuracy" },
            { type: "text", content: "Nmap allows us to control how aggressively it probes services using the --version-intensity option." },
            {
                type: "terminal",
                command: "sudo nmap -sV --version-intensity 9 10.129.2.18 -oA version_intense",
                output: "Starting Nmap 7.80...\nService scan intensity 9 (aggressive probing)\nPORT   STATE SERVICE VERSION\n80/tcp open  http    Apache httpd 2.4.29 (Custom build)"
            },
            {
                type: "table",
                columns: ["Option", "Description"],
                rows: [
                    ["--version-intensity 9", "Performs aggressive version probing (range: 0–9)."]
                ]
            },
            { type: "text", content: "Higher intensity may reveal more accurate service information but increases scan time and network noise." },
            { type: "subtitle", content: "Aggressive Scan with Version Detection" },
            { type: "text", content: "For deeper enumeration, version detection can be combined with additional scanning techniques." },
            {
                type: "terminal",
                command: "sudo nmap -A 10.129.2.18 -oA aggressive_scan",
                output: "Starting Nmap 7.80...\nPORT   STATE SERVICE VERSION\n22/ssh OpenSSH 7.6p1\n80/http Apache 2.4.29\nOS details: Linux 4.15 - 5.6"
            },
            {
                type: "table",
                columns: ["Option", "Description"],
                rows: [
                    ["-A", "Enables OS detection, version detection, script scanning, and traceroute."]
                ]
            },
            { type: "text", content: "This method provides extensive information but is noisy and more likely to be detected by IDS/IPS systems." },
            { type: "subtitle", content: "Conclusion" },
            { type: "text", content: "Version detection is a crucial phase in service enumeration, allowing penetration testers to identify running services and their exact versions. This information helps in vulnerability assessment and exploit selection. However, aggressive scans should be performed cautiously to avoid detection and disruption of services." }
        ]
    },
    "3": {
        title: "Robots.txt Information Leak",
        sections: [
            { type: "text", content: "During web application enumeration, it is important to identify files that may unintentionally disclose sensitive information. One such file is robots.txt, which is commonly used to instruct web crawlers (search engine bots) about which directories or files should not be indexed." },
            { type: "text", content: "Although robots.txt is meant for search engines, it is publicly accessible and can reveal hidden or sensitive paths, such as admin panels, backup directories, or internal resources. Attackers can use this information to further enumerate the web application." },
            { type: "subtitle", content: "Accessing Robots.txt File" },
            { type: "text", content: "The robots.txt file is usually located in the root directory of a web server and can be accessed directly via a web browser or command-line tools." },
            { type: "text", content: "Using Web Browser: http://10.129.2.18/robots.txt" },
            { type: "text", content: "If the file exists, the server will return its contents." },
            { type: "subtitle", content: "Accessing Robots.txt Using Terminal" },
            { type: "text", content: "We can also retrieve the robots.txt file using command-line tools such as curl or wget." },
            {
                type: "terminal",
                command: "curl http://10.129.2.18/robots.txt",
                output: "User-agent: *\nDisallow: /admin/\nDisallow: /backup/\nDisallow: /private/"
            },
            {
                type: "terminal",
                command: "wget http://10.129.2.18/robots.txt",
                output: "--2020-06-15 10:00:00--  http://10.129.2.18/robots.txt\nConnecting to 10.129.2.18:80... connected.\nHTTP request sent, awaiting response... 200 OK\nLength: 68 [text/plain]\nSaving to: 'robots.txt'"
            },
            { type: "subtitle", content: "Information Disclosure Analysis" },
            { type: "text", content: "From the robots.txt file, we can identify directories that the website owner does not want indexed by search engines. However, these directories may still be accessible to users." },
            {
                type: "table",
                columns: ["Potential Risks", "Description"],
                rows: [
                    ["Hidden Directories", "Disclosure of paths not intended for public discovery."],
                    ["Admin Panels", "Exposure of administrative interfaces."],
                    ["Backup Files", "Discovery of sensitive configuration or backup data."],
                    ["Attack Surface", "Increased surface for further targeted enumeration."]
                ]
            },
            { type: "text", content: "These paths can be manually tested in a browser or scanned using additional tools to check for access permissions." },
            { type: "subtitle", content: "Verification of Disallowed Directories" },
            { type: "text", content: "Once suspicious directories are found, they can be manually accessed to verify if they are reachable." },
            { type: "text", content: "Example: http://10.129.2.18/admin/ or http://10.129.2.18/backup/" },
            { type: "text", content: "If accessible, these directories may lead to sensitive information leakage or further exploitation." },
            { type: "subtitle", content: "Conclusion" },
            { type: "text", content: "The robots.txt file should never be relied upon as a security mechanism. While it helps control search engine indexing, it can unintentionally expose sensitive directories to attackers. During penetration testing, reviewing robots.txt is a simple yet effective method for discovering hidden application paths." }
        ]
    },
    "4": {
        title: "Hidden Directory Discovery",
        sections: [
            { type: "text", content: "Hidden directory discovery is a web enumeration technique used to identify unlisted or hidden directories and files on a web server. These directories are often not directly linked on the website but may still be accessible. Such directories can contain administrative panels, backups, configuration files, or development resources, which may lead to sensitive information disclosure." },
            { type: "text", content: "This technique is commonly performed using directory brute-forcing tools with predefined wordlists." },
            { type: "subtitle", content: "Directory Enumeration Using Gobuster" },
            { type: "text", content: "Gobuster is a fast and effective tool used to brute-force directories and files on web servers using wordlists." },
            {
                type: "terminal",
                command: "gobuster dir -u http://10.129.2.18/ -w /usr/share/wordlists/dirb/common.txt -o gobuster_scan.txt",
                output: "/admin        (Status: 301)\n/backup       (Status: 200)\n/uploads      (Status: 200)\n/test         (Status: 403)"
            },
            {
                type: "table",
                columns: ["Option", "Description"],
                rows: [
                    ["dir", "Enables directory brute-force mode."],
                    ["-u", "Specifies the target URL."],
                    ["-w", "Specifies the wordlist used for directory enumeration."],
                    ["-o", "Saves the scan output to a file."]
                ]
            },
            { type: "subtitle", content: "Analysis of Discovered Directories" },
            { type: "text", content: "The discovered directories may reveal valuable information depending on their access permissions." },
            {
                type: "table",
                columns: ["Status Code", "Meaning"],
                rows: [
                    ["200", "Directory is accessible."],
                    ["301/302", "Redirected directory."],
                    ["403", "Access forbidden but directory exists."],
                    ["404", "Directory not found."]
                ]
            },
            { type: "text", content: "Even directories returning 403 Forbidden confirm their existence and may be exploitable through other techniques." },
            { type: "subtitle", content: "Directory Enumeration Using Dirb" },
            { type: "text", content: "An alternative tool for hidden directory discovery is Dirb, which performs similar brute-force scanning." },
            {
                type: "terminal",
                command: "dirb http://10.129.2.18/",
                output: "-----------------\nDIRB v2.22    \nBy DarkRaoul\n-----------------\n\nOUTPUT: http://10.129.2.18/\n(UP) http://10.129.2.18/ (CODE: 200|SIZE: 11321)\n==> DIRECTORY: http://10.129.2.18/admin/\n==> DIRECTORY: http://10.129.2.18/backup/"
            },
            { type: "text", content: "Dirb uses a default wordlist and provides quick results for initial enumeration." },
            { type: "subtitle", content: "Verification of Discovered Directories" },
            { type: "text", content: "Once hidden directories are identified, they should be manually tested through a browser or further tools." },
            { type: "text", content: "Example: http://10.129.2.18/backup/ or http://10.129.2.18/uploads/" },
            { type: "text", content: "If accessible, these directories may expose sensitive files or allow further attacks such as file upload exploitation." },
            { type: "subtitle", content: "Conclusion" },
            { type: "text", content: "Hidden directory discovery is a critical phase in web application enumeration. Many web applications expose sensitive directories due to misconfigurations or leftover development files. Identifying these directories allows penetration testers to expand the attack surface and uncover potential vulnerabilities." }
        ]
    },
    "5": {
        title: "Default Credentials Abuse",
        sections: [
            { type: "text", content: "Default credentials abuse is a common security issue where systems, applications, or services are deployed with unchanged default usernames and passwords. Many software products ship with predefined credentials for initial setup, and if these credentials are not changed, attackers can easily gain unauthorized access." },
            { type: "text", content: "This issue is frequently observed in admin panels, routers, web applications, databases, and IoT devices, making it a critical risk during penetration testing." },
            { type: "subtitle", content: "Identifying Login Interfaces" },
            { type: "text", content: "Before attempting default credentials, it is necessary to identify authentication points such as login pages or admin panels." },
            { type: "text", content: "Common login paths: /login, /admin, /admin/login" },
            { type: "text", content: "These pages are commonly discovered through directory enumeration or robots.txt analysis." },
            { type: "subtitle", content: "Testing Default Credentials" },
            { type: "text", content: "Once a login interface is identified, known default credentials can be tested manually. This process should be done carefully to avoid account lockouts or detection." },
            {
                type: "table",
                columns: ["Username", "Password"],
                rows: [
                    ["admin", "admin"],
                    ["admin", "password"],
                    ["admin", "123456"],
                    ["root", "root"],
                    ["user", "user"]
                ]
            },
            { type: "text", content: "Example Attempt: Username: admin | Password: admin. If successful, it confirms a default credentials vulnerability." },
            { type: "subtitle", content: "Testing Default Credentials Using Tools" },
            { type: "text", content: "In some cases, tools can be used to automate default credential testing." },
            {
                type: "terminal",
                command: "hydra -l admin -P /usr/share/wordlists/rockyou.txt http-post-form \"/login.php:user=^USER^&pass=^PASS^:Invalid\"",
                output: "[80][http-post-form] host: 10.129.2.18   login: admin   password: admin\n1 of 1 target successfully completed, 1 valid password found"
            },
            { type: "text", content: "⚠️ Automated attacks should only be performed with proper authorization." },
            { type: "subtitle", content: "Impact of Default Credentials Abuse" },
            {
                type: "table",
                columns: ["Impact", "Description"],
                rows: [
                    ["Admin Access", "Complete control over the application or service."],
                    ["Data Manipulation", "Modify, delete, or steal sensitive information."],
                    ["Privilege Escalation", "Use access to move deeper into the network."],
                    ["Full Compromise", "Potential to take over the entire server instance."]
                ]
            },
            { type: "subtitle", content: "Mitigation Recommendations" },
            { type: "text", content: "1. Change all default usernames and passwords immediately after installation.\n2. Enforce strong password policies.\n3. Implement account lockout mechanisms to prevent brute-force.\n4. Use multi-factor authentication (MFA).\n5. Restrict admin access by IP where possible." },
            { type: "subtitle", content: "Conclusion" },
            { type: "text", content: "Default credentials abuse is a high-risk vulnerability caused by poor security practices. It is easy to exploit and often leads to full system compromise. During penetration testing, checking for default credentials is a simple but highly effective technique." }
        ]
    },
    "6": {
        title: "DOM-Based Cross-Site Scripting (XSS)",
        sections: [
            { type: "text", content: "DOM-Based Cross-Site Scripting (XSS) is a client-side vulnerability that occurs when JavaScript running in the browser processes untrusted user input and writes it directly into the Document Model (DOM) without proper sanitization or validation. Unlike reflected or stored XSS, DOM-based XSS does not require server-side involvement, making it harder to detect using traditional server-side security controls." },
            { type: "text", content: "This vulnerability can allow attackers to execute arbitrary JavaScript in the victim’s browser." },
            { type: "subtitle", content: "Identifying Potential DOM XSS Entry Points" },
            { type: "text", content: "DOM-based XSS commonly occurs when web applications use JavaScript to read data from the URL or browser objects such as: document.URL, document.location, location.href, location.search, document.referrer." },
            { type: "text", content: "Common insecure sinks: innerHTML, document.write(), eval()." },
            { type: "subtitle", content: "Manual Testing for DOM-Based XSS" },
            { type: "text", content: "To test for DOM-based XSS, we can inject JavaScript payloads into URL parameters and observe how the application processes them." },
            {
                type: "terminal",
                command: "http://10.129.2.18/search.html?q=<script>alert(1)</script>",
                output: "Alert box with '1' appears in the browser if vulnerable."
            },
            { type: "subtitle", content: "Example Vulnerable Code" },
            {
                type: "terminal",
                command: "var query = location.search;\ndocument.getElementById(\"output\").innerHTML = query;",
                output: "In this example, user-controlled input from the URL is directly injected into the DOM without sanitization, allowing script execution."
            },
            { type: "subtitle", content: "Impact of DOM-Based XSS" },
            {
                type: "table",
                columns: ["Impact", "Description"],
                rows: [
                    ["Script Execution", "Execute malicious JavaScript in the victim's session."],
                    ["Session Theft", "Steal sensitive cookies and session tokens."],
                    ["Phishing/Redirection", "Redirect users to malicious landing pages."],
                    ["Data Capture", "Log keystrokes or capture form data."]
                ]
            },
            { type: "subtitle", content: "Mitigation Recommendations" },
            { type: "text", content: "1. Avoid using dangerous JavaScript sinks like innerHTML.\n2. Use safe alternatives such as textContent.\n3. Validate and sanitize all client-side input.\n4. Implement Content Security Policy (CSP).\n5. Encode output before inserting into the DOM." },
            { type: "subtitle", content: "Conclusion" },
            { type: "text", content: "DOM-Based XSS is a critical client-side vulnerability caused by insecure JavaScript handling of user input. Because the attack occurs entirely in the browser, it can bypass server-side protections. During penetration testing, careful inspection of client-side scripts is essential to identify and mitigate this vulnerability." }
        ]
    },
    "7": {
        title: "Stored Cross-Site Scripting (XSS) via Client-Side Storage",
        sections: [
            { type: "text", content: "Stored XSS via client-side storage occurs when malicious JavaScript payloads are stored in the browser’s storage mechanisms, such as LocalStorage, SessionStorage, or IndexedDB, and later retrieved and rendered by the application without proper sanitization. Unlike traditional stored XSS, the payload is not stored on the server but persists in the client’s browser." },
            { type: "text", content: "This type of vulnerability is particularly dangerous because the malicious script executes every time the affected page loads, impacting the same user repeatedly." },
            { type: "subtitle", content: "Understanding Client-Side Storage" },
            { type: "text", content: "Modern web applications commonly use client-side storage to improve performance and user experience." },
            {
                type: "table",
                columns: ["Storage Type", "Description"],
                rows: [
                    ["LocalStorage", "Persistent storage, survives browser restarts."],
                    ["SessionStorage", "Temporary storage, cleared when the tab closes."],
                    ["IndexedDB", "Structured client-side database."]
                ]
            },
            { type: "text", content: "If data from these storage mechanisms is inserted into the DOM without sanitization, it can lead to stored XSS." },
            { type: "subtitle", content: "Identifying Vulnerable Functionality" },
            { type: "text", content: "Stored XSS via client storage is often found in features such as: User preferences (theme, username, language), Search history, Chat drafts or comments saved locally, Form auto-save functionality." },
            { type: "subtitle", content: "Manual Testing for Stored XSS via Client Storage" },
            { type: "text", content: "Step 1: Inject Payload into Client Storage using the browser developer console." },
            {
                type: "terminal",
                command: "localStorage.setItem(\"username\", \"<script>alert('XSS')</script>\");",
                output: "Payload stored in LocalStorage."
            },
            { type: "text", content: "Step 2: Trigger Payload Execution by reloading the page or navigating to the functionality that reads from storage." },
            { type: "subtitle", content: "Example Vulnerable Code" },
            {
                type: "terminal",
                command: "var name = localStorage.getItem(\"username\");\ndocument.getElementById(\"welcome\").innerHTML = name;",
                output: "This code directly writes untrusted data from LocalStorage into the DOM, resulting in stored XSS."
            },
            { type: "subtitle", content: "Impact of Stored XSS via Client Storage" },
            {
                type: "table",
                columns: ["Impact", "Description"],
                rows: [
                    ["Persistent Execution", "Malicious scripts execute every time the user visits."],
                    ["Auth Token Theft", "Steal authentication or session tokens from storage."],
                    ["Victim Impersonation", "Perform actions on behalf of the victim."],
                    ["Data Manipulation", "Manipulate application behavior or data."]
                ]
            },
            { type: "subtitle", content: "Mitigation Recommendations" },
            { type: "text", content: "1. Never trust client-side storage data.\n2. Sanitize and validate data before storage and output.\n3. Use textContent instead of innerHTML.\n4. Implement strict Content Security Policy (CSP).\n5. Clear unused or outdated client-side storage." },
            { type: "subtitle", content: "Conclusion" },
            { type: "text", content: "Stored XSS via client-side storage is a dangerous vulnerability caused by improper handling of locally stored data. Because the payload persists across sessions and reloads, it can repeatedly affect users without server interaction. Proper client-side input validation and secure DOM manipulation are essential to prevent this issue." }
        ]
    },
    "8": {
        title: "Client-Side Authentication Bypass",
        sections: [
            { type: "text", content: "Client-side authentication bypass occurs when authentication or authorization logic is implemented only in client-side code, such as JavaScript, instead of being properly enforced on the server. Since client-side code can be viewed, modified, or bypassed by an attacker, relying on it for access control is insecure." },
            { type: "text", content: "This vulnerability allows attackers to gain unauthorized access to protected areas without valid credentials." },
            { type: "subtitle", content: "Understanding Client-Side Authentication" },
            { type: "text", content: "In vulnerable applications, authentication checks may be performed using: JavaScript conditions, Hidden form fields, Cookies or LocalStorage values, URL parameters." },
            { type: "text", content: "Because these controls run in the browser, attackers can manipulate them using developer tools." },
            { type: "subtitle", content: "Identifying Client-Side Authentication Logic" },
            { type: "text", content: "Client-side authentication bypass is often discovered by inspecting JavaScript files or HTML source code." },
            { type: "text", content: "Example Indicators: Login checks implemented in JS, authentication based on LocalStorage, redirects controlled by client-side conditions." },
            { type: "subtitle", content: "Manual Authentication Bypass Using Developer Tools" },
            { type: "text", content: "Example Scenario: The application checks login status using LocalStorage." },
            {
                type: "terminal",
                command: "localStorage.setItem(\"isLoggedIn\", \"true\");",
                output: "Status set to logged in. Access granted upon refresh."
            },
            { type: "subtitle", content: "Authentication Bypass via Hidden Fields" },
            { type: "text", content: "Some applications rely on hidden form fields to verify user roles: <input type='hidden' name='role' value='user'>. Modifying this to 'admin' using developer tools can grant elevated access." },
            { type: "subtitle", content: "Impact of Client-Side Authentication Bypass" },
            {
                type: "table",
                columns: ["Impact", "Description"],
                rows: [
                    ["Restricted Access", "Access sensitive or administrative pages."],
                    ["Login Bypass", "Bypass authentication mechanisms entirely."],
                    ["Privilege Escalation", "Gain higher-level permissions (e.g., admin)."],
                    ["Data Exposure", "View or modify sensitive user and system data."]
                ]
            },
            { type: "subtitle", content: "Mitigation Recommendations" },
            { type: "text", content: "1. Enforce authentication and authorization on the server side.\n2. Never trust client-side checks for access control.\n3. Validate sessions on every request.\n4. Use secure, server-managed session tokens.\n5. Implement proper role-based access control (RBAC)." },
            { type: "subtitle", content: "Conclusion" },
            { type: "text", content: "Client-Side Authentication Bypass is a critical vulnerability caused by improper trust in client-side logic. Since client-side code can be easily manipulated, all authentication and authorization decisions must be handled securely on the server. During penetration testing, reviewing client-side logic is essential to identify this weakness." }
        ]
    }
};
