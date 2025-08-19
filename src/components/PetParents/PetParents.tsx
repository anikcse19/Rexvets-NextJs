import React from 'react';
import PetParentHeroSection from './PetParentHeroSection';
import PetParentMembershipCards from './PetParentMembershipCards';
import PetParentSupportSection from './PetParentSupportSection';
import { TestimonialsSection } from '../Home/TestimonialsSection';
import FAQSection from './FAQSection';

const PetParents = () => {
    return (
        <div>
            <PetParentHeroSection></PetParentHeroSection>
            <PetParentMembershipCards></PetParentMembershipCards>
            <PetParentSupportSection></PetParentSupportSection>
            <TestimonialsSection></TestimonialsSection>
            <FAQSection></FAQSection>
        </div>
    );
};

export default PetParents;