'use strict';

Bahmni.Registration.CreatePatientRequestMapper = (function () {
    function CreatePatientRequestMapper(currentDate) {
        this.currentDate = currentDate;
    }

    CreatePatientRequestMapper.prototype.mapFromPatient = function (patientAttributeTypes, patient) {
        var constants = Bahmni.Registration.Constants;
        var openMRSPatient = {
            patient: {
                person: {
                    names: [
                        {
                            givenName: patient.givenName,
                            middleName: patient.middleName,
                            familyName: patient.familyName,
                            preferred: false
                        }
                    ],
                    addresses: [_.pick(patient.address, constants.allAddressFileds) ],
                    birthdate: this.getBirthdate(patient.birthdate, patient.age),
                    birthdateEstimated: patient.birthdateEstimated,
                    gender: patient.gender,
                    personDateCreated: patient.registrationDate,
                    attributes: this.getMrsAttributes(patient, patientAttributeTypes),
                    dead: patient.dead,
                    deathDate: patient.deathDate
                },
                identifiers: setIdentifiers(patient)

            }
        };

        this.setImage(patient, openMRSPatient);
        return  openMRSPatient;
    };

    CreatePatientRequestMapper.prototype.setImage = function (patient, openMRSPatient) {
        if (patient.getImageData()) {
            openMRSPatient.image = patient.getImageData()
        }
    };

    CreatePatientRequestMapper.prototype.getMrsAttributes = function (patient, patientAttributeTypes) {
        return patientAttributeTypes.map(function (result) {
            var attribute = {
                attributeType: { 
                    uuid: result.uuid
                }
            };
            setAttributeValue(result, attribute, patient[result.name]);
            return  attribute;
        })
    };
    
    var setIdentifiers = function (patient) {
        var identifiers = [];
        for (var i in patient.patientIdentifiers) {
            var patientIdentifier = patient.patientIdentifiers[i];
            
            identifiers.push({
                        identifier: patientIdentifier.identifier,
                        identifierType: {
                           name: patientIdentifier.type.name
                        },
                        preferred: patientIdentifier.preferred,
                        location: patientIdentifier.location,
                        voided: false
                    });
        }
        return identifiers;
    };

    var setAttributeValue = function (attributeType, attr, value) {
        if (attributeType.format === "org.openmrs.Concept") {
            attr.hydratedObject = value;
        } else if(value === "" || value === null || value === undefined) {
            attr.voided = true;
        } else {
            attr.value = value.toString();
        }
    };

    CreatePatientRequestMapper.prototype.getBirthdate = function (birthdate, age) {
        var mnt;
        if (birthdate !== undefined) {
            mnt = moment(birthdate, 'mm/dd/yyyy');
        } else if (age !== undefined) {
            mnt = moment(this.currentDate).subtract('days', age.days).subtract('months', age.months).subtract('years', age.years);
        }
        return mnt.format('YYYY-MM-DD');
    };

    return CreatePatientRequestMapper;
})();