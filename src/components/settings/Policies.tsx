import {
  privacyPolicy,
  informationWeCollect,
  howWeUseInfo,
  sharingInfo,
  dataSecurity,
  yourRights,
  changesToPolicy,
  termsOfService,
  contactInfo,
} from "../../constants/policies";

const Policies = () => {
  return (
    <div>
      <h2>Privacy Policy for Bishell.online</h2>

      {/* privacy policy */}
      <div className="settings-privacy-item">
        <div className="privacy-text">
          <h3>Privacy Policy</h3>
          <ul style={{ padding: "0 2rem 0 2rem" }}>
            {privacyPolicy.map((item, index) => (
              <li key={index} style={{ margin: "1rem 0" }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* information we collect */}
      <div className="settings-privacy-item">
        <div className="privacy-text">
          <h3>{informationWeCollect.title}</h3>
          <ul style={{ padding: "0 2rem 0 2rem" }}>
            {informationWeCollect.items.map((section, sectionIndex) => (
              <li key={sectionIndex} style={{ margin: "1rem 0" }}>
                <h4>{section.subTitle}</h4>
                <ul>
                  {section.subItems.map((item, itemIndex) => (
                    <li key={itemIndex} style={{ margin: "1rem" }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* How we use your information */}
      <div className="settings-privacy-item">
        <div className="privacy-text">
          <h3>{howWeUseInfo.title}</h3>
          <ul style={{ padding: "0 2rem 0 2rem" }}>
            {howWeUseInfo.items.map((item, index) => (
              <li key={index} style={{ margin: "1rem 0" }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sharing Your Information */}
      <div className="settings-privacy-item">
        <div className="privacy-text">
          <h3>{sharingInfo.title}</h3>
          <p>
            <strong>{sharingInfo.intro}</strong>
          </p>
          <ul style={{ padding: "0 2rem 0 2rem" }}>
            {sharingInfo.items.map((item, index) => (
              <li key={index} style={{ margin: "1rem 0" }}>
                <strong>{item.subTitle}</strong> {item.description}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* DATA SECURITY */}
      <div className="settings-privacy-item">
        <div className="privacy-text">
          <h3>{dataSecurity.title}</h3>
          <ul style={{ padding: "0 2rem 0 2rem" }}>
            {dataSecurity.items.map((item, index) => (
              <li key={index} style={{ margin: "1rem 0" }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* YOUR RIGHTS */}
      <div className="settings-privacy-item">
        <div className="privacy-text">
          <h3>{yourRights.title}</h3>
          <ul style={{ padding: "0 2rem 0 2rem" }}>
            {yourRights.items.map((item, index) => (
              <li key={index} style={{ margin: "1rem 0" }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Changes to this policy */}
      <div className="settings-privacy-item">
        <div className="privacy-text">
          <h3>{changesToPolicy.title}</h3>
          <p>{changesToPolicy.description}</p>
        </div>
      </div>

      {/* Terms of Service */}
      <h2>{termsOfService.title}</h2>

      {termsOfService.sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="settings-privacy-item">
          <div className="privacy-text">
            <h3>{section.title}</h3>
            {section.content && <p>{section.content}</p>}
            {section.items && (
              <ul style={{ padding: "0 2rem 0 2rem" }}>
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} style={{ margin: "1rem 0" }}>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}

      {/* Contact Us */}
      <div className="settings-privacy-item">
        <div className="privacy-text">
          <h3>{contactInfo.title}</h3>
          <p>{contactInfo.description}</p>
          <ul style={{ padding: "0 2rem 0 2rem" }}>
            {contactInfo.items.map((item, index) => (
              <li key={index} style={{ margin: "1rem 0" }}>
                {index === contactInfo.items.length - 1 ? (
                  <a
                    href="https://www.facebook.com/profile.php?id=61573501162619"
                    target="_blank"
                  >
                    {item}
                  </a>
                ) : (
                  item
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Policies;
