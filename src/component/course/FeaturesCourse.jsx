import './FeaturesCourse.css';

//קומפוננטה להצגת פיטצרים של האתר בעמוד הבית
const FeaturesCourse = () => {
  const features = [
    {
      title: 'Multilingual Support',
      description: 'Display your courses in multiple languages and expand your audience. Allow students from around the world to learn in their native language.',
      icon: 'language.gif',
    },
    {
      title: 'Convenient and Flexible Payment',
      description: 'Accept payments securely and conveniently with a variety of payment options. Issue digital invoices automatically.',
      icon: 'money-bag.gif',
    },
    {
      title: 'Professional Support ',
      description: 'A skilled and friendly support team is available to assist you. Get personalized guidance and ensure you get the most out of the system.',
      icon: 'training.gif',
    },
    {
      title: 'Wide Range of Course Categories',
      description: 'Choose from a wide range of course categories, from software to art. Find the perfect course for you and start learning.',
      icon: 'list.gif',
    },
    {
      title: 'Data Security and Privacy',
      description: 'Protect your students\' information with advanced security protocols. Comply with the strictest privacy standards and ensure your data is secure.',
      icon: 'cybersecurity.gif',
    },
    {
      title: 'Convenient Location ',
      description: 'Our courses are located in central and easily accessible locations by public transport. Find the location that suits you and easily start learning.',
      icon: 'location.gif',
    },
  ];
  return (
    <div className="course-features" >
      {features.map((feature, index) => (
        <div key={index} className="feature-item">
          <img src={`../images/${feature.icon}`} alt={feature.title} className="feature-icon" />
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

export default FeaturesCourse;