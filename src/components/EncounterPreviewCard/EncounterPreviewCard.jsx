import PropTypes from 'prop-types';
import { useParams, Link } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import './EncounterPreviewCard.css';

const EncounterPreviewCard = ({ encounters }) => {
  const encounterName = encounters.encounter_name;
  const encounterSummary = encounters.summary;
  const encounterMonsters = encounters.encounter_monsters;
  const encounterPartySize = encounters.party_size;
  const encounterPartyLevel = encounters.party_level;

  return (
    <div className='EncounterPreviewCard'>
      <h2 className='preview-encounter-name'>{encounterName}</h2>
      <h3 className='preview-section-title'>Encounter Summary</h3>
      <p className='preview-encounter-summary'>{encounterSummary}</p>
      <h3 className='preview-section-title'>Monster(s)</h3>
      <ul className='preview-monster-list'>
        {encounterMonsters && encounterMonsters.map(monster => (
          <li className='preview-monster-name' key={uuid()}>{monster.monster_name}</li>
        ))}
      </ul>
      <div className='preview-small-stat'>
        <div className='preview-party-size'>
          <h3 className='preview-section-title'>Party Size</h3>
          <p className='preview-party-size-value'>{encounterPartySize}</p>
        </div>
        <div className='preview-party-level'>
          <h3 className='preview-section-title'>Party Level</h3>
          <p className='preview-party-level-value'>{encounterPartyLevel}</p>
        </div>
      </div>
    </div>
  );
};

EncounterPreviewCard.propTypes = {
};

export default EncounterPreviewCard;