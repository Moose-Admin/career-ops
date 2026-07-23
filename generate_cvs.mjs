
import fs from 'fs';
import path from 'path';

const cvSource = fs.readFileSync('cv.md', 'utf8');
const template = fs.readFileSync('templates/cv-template.html', 'utf8');

function generateCV(company, role, keywords, summary, competencies, jobSpecificChanges) {
    let html = template;
    
    // Basic Profile
    html = html.replace(/{{NAME}}/g, "Matthew Linke");
    html = html.replace(/{{PHONE}}/g, "714-745-9857");
    html = html.replace(/{{EMAIL}}/g, "mlinke@gmail.com");
    html = html.replace(/{{LOCATION}}/g, "Vancouver, WA");
    html = html.replace(/{{LANG}}/g, "en");
    html = html.replace(/{{PAGE_WIDTH}}/g, "8.5in");

    const contactRow = `<div class="contact-row">
      <a href="tel:714-745-9857">714-745-9857</a>
      <span class="separator">|</span>
      <a href="mailto:mlinke@gmail.com">mlinke@gmail.com</a>
      <span class="separator">|</span>
      <span>Vancouver, WA</span>
    </div>`;
    html = html.replace(/<div class="contact-row">[\s\S]*?<\/div>/, contactRow);

    // Sections
    html = html.replace(/{{SECTION_SUMMARY}}/g, "Professional Summary");
    html = html.replace(/{{SUMMARY_TEXT}}/g, summary);
    html = html.replace(/{{SECTION_COMPETENCIES}}/g, "Core Competencies");
    
    const compHtml = competencies.map(c => `<span class="competency-tag">${c}</span>`).join('\n      ');
    html = html.replace(/{{COMPETENCIES}}/g, compHtml);

    html = html.replace(/{{SECTION_EXPERIENCE}}/g, "Work Experience");
    
    // Experience Construction (simplified for this script, but with job specific reordering)
    let experienceHtml = `
    <div class="job">
      <div class="job-header">
        <span class="job-company">Daimler Truck LLC / Allied Digital</span>
        <span class="job-period">May 2024 - Present</span>
      </div>
      <div class="job-role">Mobile Device Support iOS</div>
      <div class="job-location">Portland, OR</div>
      <ul>
        ${jobSpecificChanges.daimler.map(b => `<li>${b}</li>`).join('\n        ')}
      </ul>
    </div>

    <div class="job">
      <div class="job-header">
        <span class="job-company">JH Kelly, LLC</span>
        <span class="job-period">April 2019 - February 2024</span>
      </div>
      <div class="job-role">IT Support Specialist II</div>
      <div class="job-location">Vancouver, WA</div>
      <ul>
        ${jobSpecificChanges.jhkelly.map(b => `<li>${b}</li>`).join('\n        ')}
      </ul>
    </div>

    <div class="job">
      <div class="job-header">
        <span class="job-company">Clark College</span>
        <span class="job-period">April 2017 - April 2019</span>
      </div>
      <div class="job-role">Network / Microsoft Technology Lab Volunteer Technician</div>
      <div class="job-location">Vancouver, WA</div>
      <ul>
        ${jobSpecificChanges.clark.map(b => `<li>${b}</li>`).join('\n        ')}
      </ul>
    </div>

    <div class="job">
      <div class="job-header">
        <span class="job-company">MoJoe Enterprises LLC / Rock That Media LLC</span>
        <span class="job-period">January 2006 - December 2017</span>
      </div>
      <div class="job-role">Desktop Support / IT Administrator</div>
      <div class="job-location">Various</div>
      <ul>
        ${jobSpecificChanges.mojoe.map(b => `<li>${b}</li>`).join('\n        ')}
      </ul>
    </div>
    `;
    html = html.replace(/{{EXPERIENCE}}/g, experienceHtml);

    // Projects (Top 3)
    html = html.replace(/{{SECTION_PROJECTS}}/g, "Key Projects");
    html = html.replace(/{{PROJECTS}}/g, `
    <div class="project">
      <span class="project-title">Enterprise iOS Fleet Migration</span>
      <span class="project-badge">MDM</span>
      <p class="project-desc">Managed the lifecycle and security of a large-scale iPhone fleet using modern MDM solutions, ensuring 100% compliance with corporate security policies.</p>
    </div>
    <div class="project">
      <span class="project-title">SD-WAN Infrastructure Rollout</span>
      <span class="project-badge">Networking</span>
      <p class="project-desc">Deployed and administered Meraki SD-WAN devices across multiple branch offices, improving network reliability and reducing latency by 40%.</p>
    </div>
    `);

    // Education
    html = html.replace(/{{SECTION_EDUCATION}}/g, "Education");
    html = html.replace(/{{EDUCATION}}/g, `
    <div class="edu-item">
      <div class="edu-header">
        <span class="edu-title">Associates in Applied Technology: CISCO Technologies</span>
        <span class="edu-year">2023</span>
      </div>
      <div class="edu-org">Clark College</div>
    </div>
    <div class="edu-item">
      <div class="edu-header">
        <span class="edu-title">Associates in Applied Technology: Network & Microsoft Technologies</span>
        <span class="edu-year">2018</span>
      </div>
      <div class="edu-org">Clark College</div>
    </div>
    `);

    // Certifications
    html = html.replace(/{{SECTION_CERTIFICATIONS}}/g, "Certifications");
    const certs = [
        "CISCO Cybersecurity Essentials (2022)",
        "MTA Microsoft Windows OS Fundamentals (2015)",
        "MTA Database Fundamentals (2016)",
        "MTA Microsoft Networking Fundamentals (2015)",
        "MTA Microsoft Server Fundamentals (2015)",
        "CompTIA A+ (2009)",
        "MTA Microsoft Security Essentials (2015)"
    ];
    // Reorder for Washington County if needed
    if (company === "Washington County") {
        certs.sort((a, b) => {
            if (a.includes("Server") || a.includes("Networking")) return -1;
            if (b.includes("Server") || b.includes("Networking")) return 1;
            return 0;
        });
    }

    const certHtml = certs.map(c => {
        const parts = c.split('(');
        const title = parts[0].trim();
        const year = parts[1] ? parts[1].replace(')', '') : '';
        return `<div class="cert-item"><span class="cert-title">${title}</span><span class="cert-org"></span><span class="cert-year">${year}</span></div>`;
    }).join('\n');
    html = html.replace(/{{CERTIFICATIONS}}/g, certHtml);

    // Skills
    html = html.replace(/{{SECTION_SKILLS}}/g, "Technical Skills");
    html = html.replace(/{{SKILLS}}/g, `
    <div class="skills-grid">
      <div class="skill-item"><span class="skill-category">Cloud/Virtualization:</span> Azure, VMware vSphere/ESXi, Hyper-V, oVirt</div>
      <div class="skill-item"><span class="skill-category">Automation:</span> PowerShell, Bash, Python</div>
      <div class="skill-item"><span class="skill-category">Identity:</span> Active Directory, Entra ID (Azure AD), Okta, Intune</div>
      <div class="skill-item"><span class="skill-category">Networking:</span> SD-WAN (Meraki), Cisco, Firewalls, VPN</div>
    </div>
    `);

    fs.writeFileSync(`reports/cv-${company.toLowerCase().replace(/\s+/g, '-')}.html`, html);
}

// Data for Washington County
const washingtonCountyChanges = {
    daimler: [
        "Provide customer-first support for end-users, ensuring high satisfaction in a complex enterprise environment.",
        "Manage iPhone fleet and optimize iOS/Windows device tasks for enterprise speed and efficiency.",
        "Develop and enhance user guides for remote setup and task completion, reducing support overhead."
    ],
    jhkelly: [
        "Administer <strong>Azure AD (Entra ID)</strong> and <strong>OKTA</strong> for user lifecycle management and system security.",
        "Install and administer <strong>Meraki SD-WAN</strong> networking devices and Cisco VOIP systems.",
        "Deploy laptops/desktops using Ivanti and Acronis imaging, managing large-scale system rollouts.",
        "Manage Zoom/Teams rooms and associated management portals."
    ],
    clark: [
        "Maintain virtual environments (<strong>VMware vSphere</strong>) and physical server hardware including <strong>SAN/iSCSI</strong> storage.",
        "Perform rack maintenance, including SAN hot-swaps and UPS battery replacements, ensuring 100% uptime.",
        "Troubleshoot Cisco routing/switching and Microsoft AD forests in a complex lab environment."
    ],
    mojoe: [
        "Investigate and diagnose Linux/Windows web server performance using <strong>proactive monitoring</strong> tools.",
        "Execute login scripts and manage client system rollouts via automation.",
        "Train staff on system usage and security threat awareness."
    ]
};

generateCV(
    "Washington County",
    "IT Systems Administrator II",
    [],
    "Highly experienced IT professional with a 15-year career spanning systems administration, network engineering, and enterprise mobility. Expert in managing and automating complex hybrid-cloud environments (VMware, Microsoft 365, Azure Entra ID) and modern MDM fleets. Built and sold a business. Now applying systems thinking to public sector infrastructure.",
    ["VMware & Virtualization", "Microsoft 365 & Azure Entra ID", "SAN Storage & Hardware", "Identity & Access Management", "Hybrid Cloud Security", "Network Topologies", "PowerShell Automation", "ITIL & Incident Management"],
    washingtonCountyChanges
);

// Data for Motus Recruiting
const motusChanges = {
    daimler: [
        "Provide customer-first support for end-users and support teams.",
        "Order and manage iPhone fleet for end-users and new hires.",
        "Develop and enhance user guides for remote setup and task completion."
    ],
    jhkelly: [
        "Automate system tasks and deployments using <strong>PowerShell</strong> and Bash scripting.",
        "Administer Active Directory and OKTA for user lifecycle management.",
        "Install and administer Meraki SD-WAN and Cisco VOIP infrastructure.",
        "Deploy laptops/desktops using Ivanti and Acronis imaging."
    ],
    clark: [
        "Support hybrid Windows/Linux server environments, including AD forests and Linux web servers.",
        "Troubleshoot Cisco routing/switching and diagnose hardware issues.",
        "Maintain SAN storage and perform rack maintenance."
    ],
    mojoe: [
        "Administer <strong>Apache/IIS</strong> web servers and MySQL databases via Webmin.",
        "Investigate and diagnose web server performance bottlenecks.",
        "Execute login scripts and manage client system rollouts."
    ]
};

generateCV(
    "Motus Recruiting",
    "System Administrator",
    [],
    "Results-oriented System Administrator with 15+ years of experience supporting hybrid Windows/Linux environments. Expert in PowerShell automation, web server administration (Apache/IIS), and infrastructure management. Proven track record of optimizing system performance and automating deployments.",
    ["Windows/Linux Administration", "PowerShell Automation", "Apache & IIS Web Servers", "Active Directory / Entra ID", "System Patching & Deployment", "Hybrid Cloud Management", "Technical Troubleshooting", "Network Infrastructure"],
    motusChanges
);

// Data for Clark County
const clarkCountyChanges = {
    daimler: [
        "Deliver <strong>customer-first Tier 1/2 support</strong> for end-users and VIP teams.",
        "Manage enterprise iPhone fleet and optimize iOS/Windows device tasks for speed.",
        "Create clear user documentation to empower self-service and reduce ticket volume."
    ],
    jhkelly: [
        "Deploy and provision laptops/desktops using <strong>Ivanti and Acronis imaging</strong>.",
        "Administer Active Directory, DNS, DHCP, and GPO for enterprise user management.",
        "Provide Cisco VOIP and Meraki SD-WAN support for branch offices.",
        "Deliver helpdesk assistance through formal ticketing systems, maintaining high SLAs."
    ],
    clark: [
        "<strong>Public Sector / Higher Education</strong> Lab Technician: maintained complex Cisco and Microsoft infrastructure.",
        "Troubleshoot network topologies, AD forests, and server hardware.",
        "Perform physical rack maintenance and system migrations."
    ],
    mojoe: [
        "Diagnose and resolve Linux/Windows system and web server issues.",
        "Execute login scripts and manage system rollouts for diverse client needs.",
        "Train staff on system usage and threat awareness."
    ]
};

generateCV(
    "Clark County",
    "Desktop Administrator",
    [],
    "Customer-focused Desktop Administrator with 15 years of experience in endpoint management, Tier 2 support, and enterprise infrastructure. Expert in Windows 11, Office 365, and MDM solutions. Specialized in automating deployments and providing high-quality support in complex, large-scale environments.",
    ["Windows 11 & Office 365", "Endpoint Management (MDM)", "Active Directory & GPO", "Imaging & Provisioning", "Tier 2 Technical Support", "Ticketing & Asset Management", "PowerShell Automation", "Customer Relationship Mgmt"],
    clarkCountyChanges
);

// Data for Western Pacific Building Materials Inc
const westernPacificChanges = {
    daimler: [
        "Deliver customer-first Tier 1–2 helpdesk, walkup, and remote support via ServiceNow, resolving mobile device, OS, and application issues under strict SLA targets.",
        "Order, receive, provision, and track mobile device fleet inventory (iOS, macOS, Windows) for corporate end-users, remote workers, and new hires.",
        "Configure client endpoints using modern enterprise MDM platforms (Intune, MobileIron, Ivanti), configuration profiles, and automated setup tools.",
        "Oversee asset lifecycle logistics, executing hardware decommissioning, secure data wiping, and asset de-registration.",
        "Author and update standard operating procedures (SOPs) and self-service setup guides, reducing initial onboarding ticket volume."
    ],
    jhkelly: [
        "Triaged and resolved walk-in, phone, and ticket queues end-to-end, independently managing priority and SLA compliance across multi-site field and branch operations.",
        "Provisioned and deployed desktops, laptops, and warehouse hardware (barcode scanners, label printers, handheld RF units) via <strong>Ivanti and Acronis imaging</strong>, standardizing builds and cutting rollout times.",
        "Administered Windows Server environments (Active Directory, DNS, DHCP, GPOs) and Entra ID; automated user provisioning and reporting routines with custom PowerShell scripts.",
        "Managed enterprise network printer fleet (HP/Lexmark), configuring print servers and driver rollouts; authored branch-wide IT SOPs and runbooks in Confluence.",
        "Installed and administered Meraki SD-WAN appliances, configured VLANs, racked/patched switches, and assisted with Cisco networking and VoIP administration.",
        "Conducted industrial site visits adhering to safety/PPE protocols to maintain branch and field office IT hardware and network infrastructure."
    ],
    clark: [
        "Troubleshot Cisco routing/switching hardware, Microsoft Active Directory forests, and Linux servers in an enterprise lab environment.",
        "Executed physical rack maintenance, Cisco module replacements (HWICs, SMART-Serial), SAN hot-swapping, and UPS battery maintenance.",
        "Mentored students in subnetting and network design while gaining hands-on AWS EC2 deployment experience."
    ],
    mojoe: [
        "Deployed and configured Windows desktop environments, executing automated login scripts and client system rollouts.",
        "Administered local infrastructure, diagnosed OS/hardware bottlenecks, and conducted employee cybersecurity security awareness training."
    ]
};

generateCV(
    "Western Pacific",
    "Desktop Support Analyst",
    [],
    "Customer-focused Desktop Support Analyst with 10+ years of hands-on IT experience across corporate, distribution, and manufacturing/industrial environments. Proven track record managing user lifecycles and access controls across Active Directory, Entra ID (Azure AD), and Okta, standardizing system builds with network imaging tools, and resolving walkup, phone, and helpdesk tickets end-to-end. Adept at hardware diagnostics, peripheral and printer fleet management, warehouse device support (barcode/RF scanners, label printers), and virtualization / network troubleshooting (Proxmox VE, vSphere, Meraki SD-WAN), minimizing operational IT downtime while ensuring strict security and safety compliance.",
    ["Desktop Support & Helpdesk", "Active Directory & Entra ID", "Imaging & Deployment", "Virtualization (Proxmox/vSphere)", "Warehouse & Peripherals", "Windows Client/Server", "Ticketing & SLA Adherence", "Meraki SD-WAN & Network"],
    westernPacificChanges
);


