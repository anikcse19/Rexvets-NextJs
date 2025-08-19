"use client";
import React from "react";
import FaqHeader from "./FaqHeader";
import FaqSection from "./FaqSection";

const FAQ: React.FC = () => {
  const faqData = [
    {
      title: "General",
      items: [
        {
          question: "Who is Rex Vets?",
          answer: [
            "At Rex Vets, we're leading the way in online veterinary telehealth, and we've achieved this by collaborating closely with veterinarians. We employ a science-backed approach to provide much-needed relief for pets dealing with both common physical and behavioral health issues.",
            "Our platform seamlessly connects you with licensed veterinarians through video calls and messaging, allowing you to access care for your beloved dog or cat swiftly and conveniently, regardless of your location. Say goodbye to the stress and expense of a traditional vet visit.",
            "In applicable states, we even offer prescription medication and over-the-counter treatments. It's important to note that Rex Vets is not a veterinary practice or pharmacy. Instead, we serve as a dedicated facilitator, ensuring that pet parents like you can access essential veterinary care with ease and convenience. We're here to make high-quality veterinary care accessible to all.",
          ],
        },
        {
          question: "Who is Rex Vets for?",
          answer: [
            "Rex Vets is designed for dog and cat parents seeking a faster, more convenient, and cost-effective solution for addressing common pet issues. We cater to those who value accessible pet care by connecting them with licensed veterinarians through video calls and messaging, sparing them from unnecessary and stressful in-person vet visits.",
            "In states that permit virtual prescription, our veterinarians can diagnose your pet's condition and formulate a comprehensive treatment plan. This may encompass prescription and non-prescription medications, as well as advice on behavioral modifications, dietary adjustments, and enriching your pet's life.",
            "In areas where virtual prescription isn't allowed, our veterinarians still offer general guidance and recommend over-the-counter treatment options. Rex Vets strives to make quality pet care accessible to all, regardless of location or state regulations.",
          ],
        },
        {
          question: "What is a visit with Rex Vets like?",
          answer: [
            "When you schedule a video call with a Rex Vets veterinarian, you'll start by answering a few questions about your pet's health concern. Depending on the nature of the issue, you might also complete a detailed questionnaire about their symptoms and share photographs to provide our veterinarians with a comprehensive understanding of the situation. You'll then select a convenient appointment time.",
            "During the video call, one of our licensed veterinarians will discuss your pet's symptoms with you, ask relevant questions, review the provided medical history, and address any concerns you may have. The vet will request to see your pet and its surroundings, and if necessary, guide you through simple checks.",
            "Following the video call, the veterinarian will send you a message containing a customized treatment plan designed to help your pet recover. This plan may include recommendations to purchase any prescribed or over-the-counter medications.",
          ],
        },
        {
          question: "What is veterinary telemedicine?",
          answer: [
            "Veterinary telemedicine is a modern and innovative way to provide healthcare for your pet. It involves sharing your pet's medical information with a licensed veterinarian, even if they're located in a different place. Through electronic communication, veterinarians can evaluate, diagnose, consult, and recommend treatment for your pet, ensuring their well-being.",
            "This approach can be in real-time, using methods such as phone calls and video chats, allowing you to have a direct conversation with the veterinarian. Additionally, it can be conducted asynchronously via email, text messages, or by uploading photos and videos of your pet.",
            "At Rex Vets, we facilitate this process by connecting you with our veterinarians through video chat for immediate assistance. We also offer messaging, making it convenient for you to seek professional advice whenever you need it.",
            "In some cases, our veterinarians may request photos and videos of your pet in their home environment to better understand the situation and provide a comprehensive evaluation. This new approach to pet care offers flexibility, accessibility, and expert guidance without the need for in-person visits.",
          ],
        },
        {
          question: "What are the benefits of veterinary telemedicine?",
          answer: [
            "Veterinary telemedicine offers a range of advantages that enhance the overall pet care experience. It provides unmatched convenience and accessibility, making it easier for pet owners to access veterinary care, often outside of traditional office hours.",
            "This can be especially beneficial for pets who find in-person visits stressful and for those residing in areas with a shortage of veterinarians. Veterinary telemedicine eliminates the need for physical travel to a vet's office, saving time and costs for pet parents. This innovative approach to pet healthcare is designed to cater to the diverse needs of pet owners, offering both practical and emotional relief.",
          ],
        },
        {
          question: "What are the risks of veterinary telemedicine?",
          answer: [
            "While veterinary telemedicine offers convenience, there are potential risks associated with its use. Delays in medical evaluation and treatment might occur due to equipment failures or information transmission issues, such as poor image resolution.",
            "Breach of privacy is a concern, especially if there are security breaches, potentially compromising personally identifiable information. Additionally, risks include adverse drug interactions, allergic reactions, complications, or errors in treatment due to incomplete medical information provided by pet owners.",
            "It's crucial to understand that telemedicine might not be suitable for all cases. If our veterinarians determine that an in-person visit is necessary for your pet's best interest, they will refer you to a local veterinarian. Rest assured, the health and safety of pets remain our utmost priority.",
          ],
        },
        {
          question: "Can I use Rex Vets for a pet health emergency?",
          answer: [
            "No. Rex Vets is intended exclusively for non-emergency situations. If your pet is facing an urgent or life-threatening condition, we strongly advise seeking immediate, in-person emergency veterinary care.",
          ],
        },
        {
          question: "Is veterinary telemedicine legal?",
          answer: [
            "Yes, veterinary telemedicine is legal. Most states require what’s known as a veterinary-client-patient relationship (VCPR) to be established in order for a veterinarian to diagnose and prescribe medications for them. A VCPR basically means that the vet has examined an animal and understands their condition well enough to diagnose and treat them.",
            "In several states, veterinarians are allowed to establish a VCPR remotely and prescribe medication if they have enough information to do so safely. However, some states require veterinarians to physically see the animal before diagnosing or prescribing medication. In these cases, veterinarians can provide general advice and suggest non-prescription treatment options remotely.",
            "At Rex Vets, our telemedicine technologies enable veterinarians to care for pets remotely. If you are in a state where a VCPR can be established virtually and you opt for a prescription appointment, the licensed veterinarian you work with will comply with state laws. However, in states where a VCPR cannot be established virtually or for advice appointments, the veterinarian can provide general advice along with non-prescription treatment options.",
          ],
        },
        {
          question: "What conditions does Rex Vets offer treatment for?",
          answer: [
            "Our licensed veterinarians at Rex Vets are equipped to provide virtual care for a wide range of pet health issues, such as anxiety, allergies, ear problems, urinary tract infections (UTIs), flea and tick concerns, upset stomach, behavioral issues, and more.",
            "Following your video call with the vet, you'll receive a personalized treatment plan, which may include prescription medications, over-the-counter treatments, behavior therapy, and dietary or enrichment recommendations. We do, however, strongly recommend that every pet parent maintain an ongoing relationship with a local veterinarian for routine check-ups and other pet medical needs. Rest assured, we are more than happy to share your pet's medical records with your local vet to ensure comprehensive care.",
          ],
        },
        {
          question: "Can you send electronic health records to my vet?",
          answer: [
            "Yes, our Rex Vets-affiliated veterinarians can electronically transfer your pet's health records to your local veterinarian. All we need is your vet's contact information to facilitate this seamless communication.",
          ],
        },
        {
          question: "What if Rex Vets can’t treat my pet?",
          answer: [
            "In some instances, certain pet conditions may be too complex for treatment through telemedicine. Rest assured, our veterinarians always prioritize your pet's well-being, and if they determine that a condition requires more specialized or urgent care, they may recommend in-person veterinary care to ensure the best possible treatment.",
          ],
        },
      ],
    },
    {
      title: "Account and Billing",
      items: [
        {
          question:
            "Who do I contact if I have issues with my Rex Vets account, subscription, or billing?",
          answer: [
            "Please reach out to support@rexvets.com and we'll get back to you within 1 business day. You can also manage your account directly by logging in at rexvets.com/registration.",
          ],
        },
        {
          question: "I forgot my password. How do I reset it?",
          answer: [
            "Go to the Rex Vets login page and hit the forgot password link. Then head to your email where you'll receive an email with instructions to reset your password.",
          ],
        },
      ],
    },
    {
      title: "Pharmacy",
      items: [
        {
          question: "Can I get prescriptions through Rex Vets?",
          answer: [
            "Prescription services through Rex Vets depend on the regulations in your state. In states where virtual prescribing is permitted, you can book an appointment with a licensed veterinarian on the Rex Vets platform, who can prescribe medication for your pet when necessary.",
            "In states where virtual prescribing is not allowed, a Rex Vets appointment provides access to veterinarians who can offer guidance on various health and behavioral issues, preventive care, and over-the-counter treatment options—all from the convenience of your home. This service can help you avoid unnecessary vet visits and reduce stress for both you and your pet.",
          ],
        },
      ],
    },
    {
      title: "Pricing",
      items: [
        {
          question: "How much will it cost for Rex Vets to treat my pet?",
          answer: [
            "At Rex Vets, we offer low-cost access to our veterinarians through video chat and messaging for your pet. Say goodbye to lengthy appointment wait times and unexpected bills.",
            "It's important to note that our veterinarians may recommend prescription or over-the-counter medications for your pet, which are to be paid separately.",
          ],
        },
      ],
    },
    {
      title: "Safety",
      items: [
        {
          question: "Is telehealth a safe way for my pet to receive treatment?",
          answer: [
            "Telehealth is a safe and effective way to treat many common pet conditions. It can be especially helpful for pets who experience stress or anxiety during visits to a traditional veterinary office. However, it's important to recognize that telehealth has its limitations and cannot entirely replace the need for a local veterinarian. Local veterinarians are essential for annual check-ups, vaccinations, testing, and issues that demand a physical examination or procedure.",
            "Rest assured, the well-being of pets is our top priority at Rex Vets. If one of our veterinarians determines that an in-person visit is in the best interest of your pet, they will refer you to a local veterinarian for the necessary care.",
          ],
        },
        {
          question: "If my pet experiences side effects, who should I contact?",
          answer: [
            "Your veterinarian will provide you with a comprehensive list of treatment benefits and discuss any potential side effects before starting any treatment plan or medication. If your pet experiences unexpected side effects or if you have any questions, you can easily get in touch with your vet via messaging or by scheduling a follow-up appointment, all included in your membership at no extra cost. Our memberships come with unlimited access to video calls and messaging with veterinarians.",
            "However, in cases where your pet is in an urgent or life-threatening condition, we strongly recommend seeking immediate in-person emergency veterinary care.",
          ],
        },
      ],
    },
    {
      title: "Treatment and Side Effects",
      items: [
        {
          question:
            "What happens if my pet experiences a bad reaction from the medication?",
          answer: [
            "If you believe your pet is experiencing an emergency due to a reaction to medications, it's essential to seek immediate assistance from an emergency veterinary clinic. For non-emergency concerns, you can easily follow up with your Rex Vets-affiliated vet by logging into your Rex Vets account and sending a message for guidance and support.",
          ],
        },
        {
          question: "Does every pet get the same treatment?",
          answer: [
            "Each pet's health and needs are unique, and our veterinarians provide personalized treatment recommendations after examining your pet during the visit. The treatment plan is tailored to your pet's specific health condition and may include prescription medication, over-the-counter treatments, behavior therapy, as well as dietary and enrichment advice. Your pet's well-being is our priority, and our vets ensure that each pet receives the most suitable care.",
          ],
        },
        {
          question: "What if Rex Vets can’t treat my pet?",
          answer: [
            "In some instances, certain pet conditions may be too complex for treatment through telemedicine. Rest assured, our veterinarians always prioritize your pet's well-being, and if they determine that a condition requires more specialized or urgent care, they may recommend in-person veterinary care to ensure the best possible treatment.",
          ],
        },
        {
          question:
            "How long will it take before I see results after my pet starts medication?",
          answer: [
            "The timeframe for seeing results from your pet's treatment can vary depending on the condition and medication prescribed. Some treatments may show results within as little as 24 hours, while others may take 4–6 weeks. Your veterinarian will provide you with a more precise estimate during your consultation, taking into consideration the specific condition and medication selected.",
          ],
        },
        {
          question:
            "My pet has diarrhea after starting medication. What should I do?",
          answer: [
            "Diarrhea is a common side effect of some treatments. Please consult your treatment plan for recommendations and message our vets for further advice.",
          ],
        },
        {
          question:
            "My pet has lost their appetite after starting medication. What should I do?",
          answer: [
            "Loss of appetite is a common side effect of some treatments. Please consult your treatment plan for recommendations and message our vets for further advice.",
          ],
        },
        {
          question: "What if my pet's initial treatment plan doesn't work?",
          answer: [
            "Every pet is unique, and their response to treatment can vary. If your pet's initial treatment plan doesn't produce the desired results, it's not uncommon, and our goal is to find the most effective approach for your pet's specific needs and genetic makeup. Rest assured, all follow-up consultations are included in your Rex Vets membership, allowing us to make necessary adjustments to the treatment plan over time. If your pet's treatment isn't working as expected or if you have any questions, simply reach out to your vet by messaging or scheduling a follow-up call.",
          ],
        },
      ],
    },
    {
      title: "Veterinary",
      items: [
        {
          question:
            "Are licensed veterinarians responsible for evaluating the health condition of your dog or cat and devising a personalized treatment plan?",
          answer: [
            "Yes, at Rex Vets, all care is provided by licensed veterinarians, guaranteeing the highest level of service and care for your pet. Our commitment to your pet's well-being is unwavering, and we strictly adhere to professional standards. In states where we are authorized to prescribe medications online, you will consistently consult with a veterinarian licensed in your state. In states where online prescribing is not permitted, you may be connected with a veterinarian licensed in a different state who can offer general advice and non-prescription treatment options.",
          ],
        },
        {
          question:
            "Is it necessary for me to inform my regular veterinarian about the services my pet receives from Rex Vets?",
          answer: [
            "While we strongly advise that you inform your primary veterinarian about all treatments and medications your pet is receiving, the decision ultimately rests with you. You can request the transfer of your pet's medical records from Rex Vets to your local veterinarian at any time by contacting support@rexvets.com.",
          ],
        },
        {
          question: "How is the vet matched with me?",
          answer: [
            "We collaborate with licensed veterinarians across the United States, and your vet will be selected based on their availability during your preferred video call time. If you require a prescription and your state permits online prescription by veterinarians, we will pair you with a vet licensed in your state. In case you're seeking advice only, or you reside in a state where online prescription isn't allowed, you might be matched with a veterinarian licensed in a different state.",
          ],
        },
        {
          question: "Where are your veterinarians based?",
          answer: [
            "Our network includes licensed veterinarians from across the country. If you reside in a state where we can provide prescriptions, you will consistently interact with a veterinarian licensed in your state. In states where online prescription services are restricted, you may be connected with a veterinarian licensed in a different state.",
          ],
        },
        {
          question:
            "How soon will I receive the treatment plan from my vet after the appointment?",
          answer: [
            "Usually, your treatment plan is prepared and sent by the vet within one business day.",
          ],
        },
        {
          question: "How can I contact a vet?",
          answer: [
            "You can arrange a video appointment with a vet by logging in at rexvets.com. After scheduling an appointment, you can send a message to your vet through your Rex Vets account.",
          ],
        },
        {
          question: "Is Rex Vets a substitute for a local veterinary hospital?",
          answer: [
            "No, Rex Vets is not intended to replace your local veterinary hospital. While our veterinarians can provide guidance on improving your pet's quality of life, help you understand their well-being, address specific issues, and prescribe medications for certain conditions, they cannot conduct physical examinations, blood tests, administer vaccinations, perform surgeries, or handle other hands-on medical procedures. We strongly recommend that you maintain your relationship with your current vet for all other needs, including routine check-ups, vaccinations, and emergency care. Our vets can assist you in determining if your pet requires urgent attention for non-life-threatening issues. However, if your pet is experiencing symptoms such as shortness of breath, collapse, seizures, bleeding, or other life-threatening conditions, it is essential to seek immediate care at an emergency veterinary clinic.",
          ],
        },
        {
          question:
            "How frequently should I have follow-up appointments with the vet?",
          answer: [
            "We recommend that you reach out to your vet or schedule a new appointment whenever you have inquiries or require ongoing care.",
          ],
        },
        {
          question:
            "I am a licensed veterinarian. How can I become a part of the Rex Vets team?",
          answer: [
            "We are continually seeking licensed veterinarians to join us. If you possess a valid veterinary license in one or more states, we are eager to discuss potential opportunities with you. In states where we provide prescription services, you will also need a valid DEA license to prescribe gabapentin. To gather more information and get in touch with our recruitment team, please visit https://www.rexvets.com/VetsandTechs or initiate a conversation by emailing support@rexvets.com.",
          ],
        },
      ],
    },
  ];
  return (
    <div className="flex flex-col min-h-screen">
      <FaqHeader />
      {faqData.map((section, index) => (
        <FaqSection
          key={index}
          title={section.title}
          items={section.items}
          index={index}
        />
      ))}
    </div>
  );
};

export default React.memo(FAQ);
