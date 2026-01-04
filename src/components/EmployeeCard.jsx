import React from 'react';
import { getSkillColor } from '../utils/helpers';
import './EmployeeCard.css';

const EmployeeCard = ({ employee }) => {
    return (
        <div className="employee-card glass-card">
            <div className="employee-header">
                <div className="employee-avatar">
                    {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div className="employee-info">
                    <h3 className="employee-name">{employee.name}</h3>
                    <p className="employee-department">{employee.department}</p>
                </div>
            </div>

            <div className="employee-details">
                <div className="detail-item">
                    <span className="detail-label">Experience</span>
                    <span className="badge badge-primary">{employee.years_experience} years</span>
                </div>

                {employee.skills && employee.skills.length > 0 && (
                    <div className="detail-item">
                        <span className="detail-label">Skills</span>
                        <div className="skills-container">
                            {employee.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="skill-tag"
                                    style={{ background: getSkillColor(skill) }}
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeCard;
