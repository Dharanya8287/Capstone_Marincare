"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";
import { Snackbar, Alert } from "@mui/material";

/* Styled Components */
const FooterContainer = styled("footer")(() => ({
    background: "#F5F9FA",
    padding: "80px 100px 40px",
    color: "#003554",
    fontFamily: "Inter, sans-serif",
    "@media (max-width: 1024px)": {
        padding: "60px 40px 30px",
    },
    "@media (max-width: 768px)": {
        padding: "40px 20px 100px",
        marginBottom: 0,
    },
}));

const TopSection = styled("div")(() => ({
    display: "grid",
    gridTemplateColumns: "400px 1fr",
    gap: "80px",
    maxWidth: "1400px",
    margin: "0 auto 50px",
    "@media (max-width: 1200px)": {
        gridTemplateColumns: "350px 1fr",
        gap: "60px",
    },
    "@media (max-width: 1024px)": {
        gridTemplateColumns: "1fr",
        gap: "40px",
        marginBottom: "40px",
    },
    "@media (max-width: 768px)": {
        gap: "32px",
        marginBottom: "32px",
    },
}));

const About = styled("div")(() => ({
    maxWidth: "100%",
    "@media (max-width: 768px)": {
        maxWidth: "100%",
    },
}));

const LogoRow = styled("div")(() => ({
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
}));

const LogoText = styled("h4")(() => ({
    color: "#0891B2",
    fontWeight: 700,
    fontSize: 22,
    margin: 0,
    "@media (max-width: 768px)": {
        fontSize: 20,
    },
}));

const Description = styled("p")(() => ({
    color: "#5A7B8A",
    lineHeight: 1.7,
    fontSize: 15,
    marginBottom: 24,
    "@media (max-width: 768px)": {
        fontSize: 14,
        lineHeight: 1.6,
    },
}));

const NewsletterSection = styled("div")(() => ({
    marginTop: 24,
}));

const NewsletterTitle = styled("h5")(() => ({
    fontSize: 15,
    fontWeight: 600,
    color: "#003554",
    marginBottom: 12,
    "@media (max-width: 768px)": {
        fontSize: 14,
    },
}));

const NewsletterForm = styled("div")(() => ({
    display: "flex",
    gap: 10,
    alignItems: "center",
    marginBottom: 8,
}));

const EmailInput = styled("input")(() => ({
    flex: 1,
    border: "1px solid #D1E5ED",
    borderRadius: 8,
    padding: "11px 14px",
    fontSize: 14,
    color: "#003554",
    background: "#ffffff",
    outline: "none",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
    "&:focus": {
        borderColor: "#0891B2",
        boxShadow: "0 0 0 3px rgba(8, 145, 178, 0.1)",
    },
    "&::placeholder": {
        color: "#9BB5C0",
    },
}));

const SubmitButton = styled("button")(() => ({
    background: "#0891B2",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "11px 18px",
    fontSize: 16,
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 0.3s ease, transform 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
        background: "#0077A3",
        transform: "translateY(-1px)",
    },
    "&:active": {
        transform: "translateY(0)",
    },
}));

const NewsletterHint = styled("span")(() => ({
    fontSize: 12,
    color: "#6B8C98",
    lineHeight: 1.4,
}));

const LinksSection = styled("div")(() => ({
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "60px",
    "@media (max-width: 1200px)": {
        gap: "50px",
    },
    "@media (max-width: 1024px)": {
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "40px",
    },
    "@media (max-width: 768px)": {
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "24px 16px",
    },
}));

const LinkColumn = styled("div")(() => ({
    "@media (max-width: 768px)": {
        minWidth: "unset",
    },
}));

const ColumnTitle = styled("h5")(() => ({
    color: "#003554",
    fontWeight: 600,
    fontSize: 16,
    marginBottom: 16,
    "@media (max-width: 768px)": {
        fontSize: 15,
        marginBottom: 12,
    },
}));

const LinkList = styled("ul")(() => ({
    listStyle: "none",
    padding: 0,
    margin: 0,
}));

const LinkItem = styled("li")(() => ({
    color: "#6B8C98",
    fontSize: 14,
    marginBottom: 12,
    cursor: "pointer",
    transition: "color 0.2s ease, transform 0.2s ease",
    "&:hover": {
        color: "#0891B2",
        transform: "translateX(2px)",
    },
    "@media (max-width: 768px)": {
        fontSize: 13,
        marginBottom: 10,
    },
}));

const ContactArea = styled("div")(() => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "30px",
    paddingTop: "32px",
    borderTop: "1px solid #D1E5ED",
    maxWidth: "1400px",
    margin: "0 auto",
    "@media (max-width: 1024px)": {
        gap: "20px",
    },
    "@media (max-width: 768px)": {
        flexDirection: "column",
        gap: "16px",
        paddingTop: "24px",
    },
}));

const ContactCard = styled("div")(() => ({
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: "#FFFFFF",
    borderRadius: 12,
    padding: "18px 28px",
    boxShadow: "0 2px 8px rgba(0, 83, 116, 0.06)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    minWidth: 280,
    "@media (max-width: 1024px)": {
        minWidth: 240,
        padding: "16px 24px",
    },
    "@media (max-width: 768px)": {
        width: "100%",
        minWidth: "unset",
        justifyContent: "flex-start",
        padding: "16px 20px",
    },
    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 12px rgba(0, 83, 116, 0.12)",
    },
}));

const IconWrapper = styled("div")(() => ({
    width: 44,
    height: 44,
    borderRadius: 10,
    background: "#E6F7FA",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    "@media (max-width: 768px)": {
        width: 40,
        height: 40,
    },
}));

const ContactInfo = styled("div")(() => ({
    display: "flex",
    flexDirection: "column",
    gap: 2,
}));

const ContactLabel = styled("p")(() => ({
    fontWeight: 600,
    color: "#0891B2",
    margin: 0,
    fontSize: 14,
    "@media (max-width: 768px)": {
        fontSize: 13,
    },
}));

const ContactValue = styled("p")(() => ({
    color: "#003554",
    fontSize: 15,
    margin: 0,
    fontWeight: 500,
    "@media (max-width: 768px)": {
        fontSize: 14,
    },
}));

/* Component */
export default function Footer() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNewsletterSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !email.includes("@")) {
            setSnackbar({ open: true, message: "Please enter a valid email address", severity: "error" });
            return;
        }

        setIsSubmitting(true);
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/subscribe`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setSnackbar({ open: true, message: "Successfully subscribed to our newsletter! 🎉", severity: "success" });
                setEmail("");
            } else {
                setSnackbar({ open: true, message: data.message || "Subscription failed. Please try again.", severity: "error" });
            }
        } catch (error) {
            console.error("Newsletter subscription error:", error);
            setSnackbar({ open: true, message: "Network error. Please try again later.", severity: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const navigationLinks = {
        platform: [
            { label: "Challenges", path: "/challenges" },
            { label: "Upload Cleanup", path: "/upload" },
            { label: "Dashboard", path: "/dashboard" },
            { label: "Achievements", path: "/achievements" },
        ],
        resources: [
            { label: "How It Works", path: "/home" },
            { label: "AI Detection", path: "/upload" },
            { label: "Impact Reports", path: "/dashboard" },
        ],
        company: [
            { label: "About Us", path: "#" },
            { label: "Our Mission", path: "#" },
            { label: "Contact", path: "#" },
        ],
    };

    const linkGroups = [
        {
            title: "Platform",
            items: navigationLinks.platform,
        },
        {
            title: "Resources",
            items: navigationLinks.resources,
        },
        {
            title: "Company",
            items: navigationLinks.company,
        },
    ];

    return (
        <FooterContainer>
            {/* Top Section */}
            <TopSection>
                {/* About Section */}
                <About>
                    <LogoRow>
                        <Image
                            src="/images/logo.png"
                            alt="WaveGuard Logo"
                            width={36}
                            height={36}
                        />
                        <LogoText>WaveGuard</LogoText>
                    </LogoRow>

                    <Description>
                        AI-powered platform connecting volunteers across Canada to protect
                        our 243,042 km of coastline. Together, we're making cleanup efforts
                        measurable and impactful.
                    </Description>

                    {/* Newsletter */}
                    <NewsletterSection>
                        <NewsletterTitle>Subscribe to our newsletter</NewsletterTitle>

                        <NewsletterForm as="form" onSubmit={handleNewsletterSubmit}>
                            <EmailInput
                                type="email"
                                placeholder="your@email.com"
                                aria-label="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isSubmitting}
                            />
                            <SubmitButton 
                                type="submit" 
                                aria-label="Subscribe"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "..." : "→"}
                            </SubmitButton>
                        </NewsletterForm>
                        <NewsletterHint>
                            Get updates on cleanup challenges and impact reports.
                        </NewsletterHint>
                    </NewsletterSection>
                </About>

                {/* Links Section */}
                <LinksSection>
                    {linkGroups.map((group, idx) => (
                        <LinkColumn key={idx}>
                            <ColumnTitle>{group.title}</ColumnTitle>
                            <LinkList>
                                {group.items.map((item) => (
                                    <LinkItem 
                                        key={item.label}
                                        onClick={() => {
                                            if (item.path !== "#") {
                                                router.push(item.path);
                                            }
                                        }}
                                        style={{ 
                                            cursor: item.path === "#" ? "default" : "pointer",
                                            opacity: item.path === "#" ? 0.6 : 1
                                        }}
                                    >
                                        {item.label}
                                    </LinkItem>
                                ))}
                            </LinkList>
                        </LinkColumn>
                    ))}
                </LinksSection>
            </TopSection>

            {/* Contact Information */}
            <ContactArea>
                <ContactCard>
                    <IconWrapper>
                        <Image
                            src="/images/mail.png"
                            alt="Mail Icon"
                            width={22}
                            height={22}
                        />
                    </IconWrapper>
                    <ContactInfo>
                        <ContactLabel>Email Us</ContactLabel>
                        <ContactValue>support@waveguard.ca</ContactValue>
                    </ContactInfo>
                </ContactCard>

                <ContactCard>
                    <IconWrapper>
                        <Image
                            src="/images/phone.png"
                            alt="Phone Icon"
                            width={22}
                            height={22}
                        />
                    </IconWrapper>
                    <ContactInfo>
                        <ContactLabel>Call Us</ContactLabel>
                        <ContactValue>1-800-WAVE-GUARD</ContactValue>
                    </ContactInfo>
                </ContactCard>

                <ContactCard>
                    <IconWrapper>
                        <Image
                            src="/images/location.png"
                            alt="Location Icon"
                            width={22}
                            height={22}
                        />
                    </IconWrapper>
                    <ContactInfo>
                        <ContactLabel>Location</ContactLabel>
                        <ContactValue>Coast to Coast, Canada</ContactValue>
                    </ContactInfo>
                </ContactCard>
            </ContactArea>

            {/* Snackbar for success/error messages */}
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={4000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </FooterContainer>
    );
}