import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Tailwind,
    Text,
  } from "@react-email/components";
  import * as React from "react";
  
  interface MagicLinkEmailProps {
    magicLink: string;
    appName: string;
  }
  
  export default function MagicLinkEmail({
    magicLink, // Destructure magicLink here
    appName // Default app name
  }: MagicLinkEmailProps) {
    const previewText = `Log in to ${appName} with this magic link`;
  
    return (
      <Html>
        <Head />
        <Preview>{previewText}</Preview>
        <Tailwind>
          <Body className="mx-auto my-auto bg-white font-sans">
            <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
              <Section className="mt-[32px]">
                {/* You can add a logo here if you have one */}
                {/* <Img src={`${baseUrl}/static/logo.png`} width="40" height="37" alt="App Logo" className="mx-auto my-0" /> */}
              </Section>
              <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
                Log in to <strong>{appName}</strong>
              </Heading>
              <Text className="text-[14px] leading-[24px] text-black">
                Hello,
              </Text>
              <Text className="text-[14px] leading-[24px] text-black">
                Click the button below to securely log in to your {appName}{" "}
                account. This link is valid for a short period and can only be
                used once.
              </Text>
              <Section className="mb-[32px] mt-[32px] text-center">
                <Button
                  className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                  href={magicLink} // Use the destructured magicLink prop
                >
                  Log In
                </Button>
              </Section>
              <Text className="text-[14px] leading-[24px] text-black">
                Or copy and paste this URL into your browser:{" "}
                <Link
                  href={magicLink} // Use the destructured magicLink prop
                  className="text-blue-600 no-underline"
                >
                  {magicLink} {/* Use the destructured magicLink prop */}
                </Link>
              </Text>
              <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
              <Text className="text-[12px] leading-[24px] text-[#666666]">
                If you didn&apos;t request this email, you can safely ignore it. This
                link will expire shortly.
              </Text>
              {/* Optional Footer */}
              {/* <Text className="text-[12px] leading-[24px] text-[#666666]">
                  © {new Date().getFullYear()} {appName}, Inc. All Rights Reserved.
                </Text> */}
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  }
  