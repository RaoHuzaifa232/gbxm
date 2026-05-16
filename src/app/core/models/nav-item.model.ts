export interface NavItem {
  label: string;
  link?: string;
  icon?: string;
  children?: NavItem[];
  expanded?: boolean;
}

export const NAVIGATION_DATA: NavItem[] = [
  {
    label: 'Operator Console',
    children: [
      { label: 'Edit My Profile', link: '/operator-console/edit-my-profile', icon: 'person_edit.svg' },
      { label: 'View All Profiles', link: '/operator-console/view-all-profiles', icon: 'headset_mic.svg' },
      { label: 'Verify Operator', link: '/operator-console/verify-operator', icon: 'Group.svg' }
    ]
  },
  {
    label: 'Campaigns',
    children: [
      { label: 'All Campaigns', link: '/campaigns/all-campaigns', icon: 'holiday_village.svg' },
      { label: 'Define Campaigns', link: '/campaigns/define-campaign', icon: 'quick_reference_all.svg' },
      { label: 'Add Pick Lists', link: '/campaigns/add-pick-lists', icon: 'note_add.svg' },
      { label: 'My Campaigns', link: '/campaigns/my-campaigns', icon: 'source_environment.svg' },
      { label: 'Access Property View', link: '/coming-soon/access-property-view', icon: 'real-estate-property.svg' }
    ]
  },
  {
    label: 'Communications',
    children: [
      { label: 'Campaign Messages', link: '/coming-soon/campaign-messages', icon: 'Vector.svg' }
    ]
  },
  {
    label: 'Introduction & Concepts',
    children: [
      { label: 'Property Welcome', link: '/coming-soon/property-welcome', icon: 'PropertyWelcome.svg' },
      { label: 'Hospitality Professional!', link: '/coming-soon/hospitality-professional', icon: 'HospitalityProfessional.svg' },
      { label: 'CEO’s Greetings', link: '/coming-soon/ceos-greetings', icon: 'CEOGreetings.svg' },
      { label: 'GBXM Overview', link: '/coming-soon/gbxm-overview', icon: 'GBXMOverview.svg' },
      { label: 'GXI Success', link: '/coming-soon/gxi-success', icon: 'GXISuccess.svg' },
      { label: 'GXI Culture', link: '/coming-soon/gxi-culture', icon: 'GXICulture.svg' },
      { label: 'Personalized-to-Pocket', link: '/coming-soon/personalized-to-pocket', icon: 'Personalized-to-Pocket.svg' },
      { label: 'The Escape', link: '/coming-soon/the-escape' },
      { label: 'Excellence', link: '/coming-soon/excellence', icon: 'boxicons_seal-check.svg' },
      { label: 'Simplicity', link: '/coming-soon/simplicity', icon: 'Simplicity.svg' },
      { label: 'Certainty', link: '/coming-soon/certainty', icon: 'Certainty.svg' },
      { label: 'Alignment', link: '/coming-soon/alignment', icon: 'Alignment.svg' },
      { label: 'Productivity', link: '/coming-soon/productivity', icon: 'Productivity.svg' },
      { label: 'Engagement', link: '/coming-soon/engagement', icon: 'Engagement.svg' }
    ]
  },
  {
    label: 'GBXM Components',
    children: [
      { label: 'Job Guides', link: '/coming-soon/job-guides', icon: 'JobGuides.svg' },
      { label: 'Daily Briefings', link: '/coming-soon/daily-briefings', icon: 'DailyBriefings.svg' },
      { label: 'Orientation', link: '/coming-soon/orientation', icon: 'Orientation.svg' },
      { label: 'Team Quality Requirements', link: '/coming-soon/team-quality-requirements', icon: 'TeamQualityRequirements.svg' },
      { label: 'GXM Exceptional Service', link: '/coming-soon/gxm-exceptional-service', icon: 'GXMExceptionalService.svg' },
      { label: 'OXM Operating Standards', link: '/coming-soon/oxm-operating-standards', icon: 'OXMOperatingStandards.svg' },
      { label: 'DXM Progress Reports', link: '/coming-soon/dxm-progress-reports', icon: 'DXMProgressReports.svg' },
      { label: 'Achievement Certification', link: '/coming-soon/achievement-certification', icon: 'AchievementCertification.svg' }
    ]
  },
  {
    label: 'Directory',
    children: [
      { label: 'Property Details', link: '/coming-soon/property-details', icon: 'PropertyDetails.svg' },
      { label: 'Your Contacts', link: '/coming-soon/your-contacts', icon: 'YourContacts.svg' }
    ]
  },
  {
    label: 'Hands On',
    children: [
      { label: 'GM Access Credentials', link: '/coming-soon/gm-access-credentials', icon: 'GMAccessCredentials.svg' },
      { label: 'Invite ExCom', link: '/coming-soon/invite-excom', icon: 'InviteExCom.svg' },
      { label: 'Owner Briefing', link: '/coming-soon/owner-briefing', icon: 'OwnerBriefing.svg' }
    ]
  },
  {
    label: 'Licencing',
    children: [
      {
        label: 'Property License (EULA)',
        children: [
          { label: 'License Parties', link: '/coming-soon/license-parties', icon: 'LicenseParties.svg' }
        ]
      },
      { label: 'Pricing', link: '/coming-soon/pricing', icon: 'Pricing.svg' },
      {
        label: 'ROI Calculators',
        children: [
          { label: 'Tenure & On Cost', link: '/coming-soon/tenure-on-cost', icon: 'TenureOnCost.svg' },
          { label: 'Rooms Upsales', link: '/coming-soon/rooms-upsales', icon: 'RoomsUpsales.svg' },
          { label: 'F&B Upsales', link: '/coming-soon/fb-upsales', icon: 'FBUpsales.svg' },
          { label: 'Operational', link: '/coming-soon/operational', icon: 'Operational.svg' }
        ]
      },
      { label: 'Approval & Purchase Order', link: '/coming-soon/approval-purchase-order', icon: 'ApprovalPurchaseOrder.svg' },
      { label: 'Order Tracking', link: '/coming-soon/order-tracking', icon: 'OrderTracking.svg' },
      { label: 'Account Admin', link: '/coming-soon/account-admin', icon: 'AccountAdmin.svg' }
    ]
  },
  {
    label: 'Activation',
    children: [
      { label: 'Switch On', link: '/coming-soon/switch-on', icon: 'SwitchOn.svg' },
      { label: 'Expand', link: '/coming-soon/expand', icon: 'Expand.svg' },
      { label: 'Engage', link: '/coming-soon/engage', icon: 'Engage.svg' }
    ]
  },
  {
    label: 'Other Information',
    children: [
      { label: 'Papers', link: '/coming-soon/papers', icon: 'Papers.svg' },
      { label: 'Videos', link: '/coming-soon/videos', icon: 'Videos.svg' },
      { label: 'FAQs', link: '/coming-soon/faqs', icon: 'FAQs.svg' }
    ]
  }
];
