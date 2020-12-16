export function userLoginQuery(email: string, password: string, imei: string) {
    return {
        text: 'SELECT "ingrijiriPaleative"."userLogin"($1, $2, $3)',
        values: [email, password, imei]
    }
}

export function getUserDataQuery(email: string) {
    return {
        text: `SELECT id,
                      "idClient",
                      "idPersAsisoc",
                      email,
                      imei,
                      nume,
                      tip,
                      logins,
                      avatar
               FROM "ingrijiriPaleative".users
               WHERE email = $1`,
        values: [email]
    }
}

export function userPasswordResetQuery(email: string, password: string) {
    return {
        text: 'SELECT "ingrijiriPaleative"."userPasswordReset"($1, $2)',
        values: [email, password]
    }
}

export function findUserQuery(email: string) {
    return {
        text: `SELECT *
               FROM "ingrijiriPaleative".users
               WHERE email = $1`,
        values: [email]
    }
}

export function insertNewUserQuery(email: string, password: string, name: string, type: string, imei: string, idClient = null) {
    return {
        text: 'SELECT "ingrijiriPaleative"."addUserAccount"($1, $2, $3, $4, $5, $6)',
        values: [email, password, name, type, imei, idClient]
    }
}

export function register(email: string, password: string, name: string, imei: string) {
    return {
        text: 'SELECT "ingrijiriPaleative"."register"($1, $2, $3, $4)',
        values: [email, password, name, imei]
    }
}

export function updateFirstLoginQuery(email: string, avatar: string, genter: string, dateOfBirth: string) {
    return {
        text: `UPDATE "ingrijiriPaleative".users
               SET logins        = true,
                   avatar        = $2,
                   sex           = $3,
                   "dataNastere" = $4
               WHERE email = $1`,
        values: [email, avatar, genter, dateOfBirth]
    }
}

export function nearMeQuery(email: string) {
    return {
        text: `SELECT email, nume, avatar
               FROM "ingrijiriPaleative".users
               WHERE email != $1`,
        values: [email]
    }
}

export function isNearQuery(userId: number, id: number, distance: number) {
    return {
        text: 'SELECT "ingrijiriPaleative"."getUsersByDistance"($1, $2, $3) as res',
        values: [userId, id, distance]
    }
}

export function getAvatarQuery(email: string) {
    return {
        text: `SELECT avatar
               FROM "ingrijiriPaleative".users
               WHERE email = $1`,
        values: [email]
    }
}

export function getUserMedsQuery(idClient: number, before: string, after: string) {
    return {
        text: `SELECT *
               FROM "ingrijiriPaleative"."usersMedicine"
               WHERE "idUser" = $1
                 and timestamp >= $2
                 and timestamp <= $3
                 and taken is null`,
        values: [idClient, before, after]
    }
}

export function updateLocationQuery(idUser: number, latitude: number, longitude: number) {
    return {
        text: 'SELECT "ingrijiriPaleative"."actualizareLocatieUtilizatori"($1, $2)',
        values: [idUser, `POINT(${latitude} ${longitude})`]
    }
}

export function inserNewSharingPeopleQuery(from: string, dest: string) {
    return {
        text: 'SELECT "ingrijiriPaleative"."connectingPeople"($1, $2)',
        values: [from, dest]
    }
}

export function getSharingPeopleQuery(email: string) {
    return {
        text: `SELECT id, nume as name, email, imei
               FROM "ingrijiriPaleative".users
               WHERE id IN (
                   SELECT uds."idFrom"
                   FROM "ingrijiriPaleative"."usersDataSharing" uds
                   WHERE uds."idDest" = (
                       SELECT id
                       FROM "ingrijiriPaleative".users
                       WHERE email = $1
                   )
               )`,
        values: [email]
    }
}

export function getSharedPeopleQuery(id: string) {
    return {
        text: `SELECT nume as name, email, avatar
               FROM "ingrijiriPaleative".users
               WHERE id IN (
                   SELECT "idDest"
                   FROM "ingrijiriPaleative"."usersDataSharing"
                   WHERE "idFrom" = $1
               )`,
        values: [id]
    }
}

export function deleteSharingPeopleQuery(idFrom: string, emailDest: string) {
    return {
        text: `DELETE
               FROM "ingrijiriPaleative"."usersDataSharing"
               WHERE "idFrom" = $1
                 AND "idDest" = (
                   SELECT id
                   FROM "ingrijiriPaleative".users
                   WHERE email = $2
               )`,
        values: [idFrom, emailDest]
    }
}

export function getDiseaseQuery() {
    return {
        text: 'SELECT * FROM "ingrijiriPaleative"."nomenclatorBoli"',
        values: []
    }
}

export function medicineQuery(uuid: string, date: string) {
    return {
        text: 'INSERT INTO "ingrijiriPaleative"."usersConfirmMedicine"(uuid, timestamp) VALUES($1, $2)',
        values: [uuid, date]
    }
}

export function firstSetupQuery(idUser: string, idDisease: string) {
    return {
        text: 'INSERT INTO "ingrijiriPaleative"."usersDiseases" ("idUser", "idDisease") VALUES ($1, $2)',
        values: [idUser, idDisease]
    }
}

export function insertConsultationQuery(idClient: number, idAssistant: number, idPatient: number, startTime: string, endTime: string, activity: string, details: string, longitude: string, latitude: string) {
    return {
        text: `INSERT INTO "ingrijiriPaleative".consultatii("idClient", "idAsistent", "idPacient", "oraStart",
                                                            "oraStop", "activitati", "detalii", "locatie")
               VALUES ($1, $2, $3, $4, $5, $6, $7, ST_SetSRID(ST_MakePoint($8, $9), 4326))`,
        values: [idClient, idAssistant, idPatient, startTime, endTime, activity, details, longitude, latitude]
    }
}

export function bloodPressureQuery(imei: string, date: string) {
    return {
        text: `SELECT AVG("bloodPressureSystolic")::INTEGER  as systolic,
                      AVG("bloodPressureDiastolic")::INTEGER as diastolic,
                      AVG("bloodPressurePulseRate")::INTEGER as "pulseRate",
                      date("dateTimeISO")                    as date
               FROM public."deviceMeasurement"
               WHERE IMEI = $1
                 AND "dateTimeISO" > $2
                 AND "bloodPressureSystolic" > 0
               GROUP BY date("dateTimeISO")`,
        values: [imei, date]
    }
}

export function bloodGlucoseQuery(imei: string, date: string) {
    return {
        text: `SELECT AVG("bloodGlucose")::INTEGER, date("dateTimeISO") as date
               FROM public."deviceMeasurement"
               WHERE IMEI = $1
                 AND "dateTimeISO" > $2
                 AND "bloodGlucose" > 0
               GROUP BY date("dateTimeISO")`,
        values: [imei, date]
    }
}

export function smartbandQuery(imei: string, date: string) {
    return {
        text: `SELECT "sleepType", "sleepSeconds", "dateTimeISO" as date
               FROM public."deviceMeasurement"
               WHERE IMEI = $1
                 AND "dateTimeISO" > $2
                 AND "sleepType" IS NOT NULL`,
        values: [imei, date]
    }
}

export function bloodPressureDayQuery(imei: string, date: string) {
    return {
        text: `SELECT "bloodPressureSystolic"  as systolic,
                      "bloodPressureDiastolic" as diastolic,
                      "bloodPressurePulseRate" as "pulseRate",
                      "dateTimeISO"            as "date"
               FROM public."deviceMeasurement"
               WHERE IMEI = $1
                 AND date("dateTimeISO") = $2
                 AND "bloodPressureSystolic" > 0
               ORDER BY "dateTimeISO"`,
        values: [imei, date]
    }
}

export function bloodGlucoseDayQuery(imei: string, date: string) {
    return {
        text: `SELECT "bloodGlucose", "dateTimeISO" as date
               FROM public."deviceMeasurement"
               WHERE IMEI = $1
                 AND date("dateTimeISO") = $2
                 AND "bloodGlucose" > 0`,
        values: [imei, date]
    }
}

export function smartBandDayQuery(imei: string, date: string) {
    return {
        text: `SELECT "sleepType", "sleepSeconds", "dateTimeISO" as date
               FROM public."deviceMeasurement"
               WHERE IMEI = $1
                 AND date("dateTimeISO") = $2
                 AND "sleepType" IS NOT NULL`,
        values: [imei, date]
    }
}

export function getBenefits() {
    return {
        text: `SELECT *
               FROM "ingrijiriPaleative"."usersBenefits"`,
        values: []
    }
}

export function medicineHistory(idClient: number, idPersAsisoc: number, start: string, stop: string) {
    return {
        text: `select um.*
               from "ingrijiriPaleative".users u
                        inner join "ingrijiriPaleative"."usersMedicine" um
                                   on um."idUser" = u.id
               where u."idClient" = $1
                 AND u."idPersAsisoc" = $2
                 AND date(um.timestamp) >= $3
                 AND date(um.timestamp) <= $4
               ORDER BY um.timestamp`,
        values: [idClient, idPersAsisoc, start, stop]
    }
}

export function benefit(idClient: string, idPersAsisoc: string, start: string, stop: string, tip = null) {
    return {
        text: `SELECT "ingrijiriPaleative"."asisocConsult"($1)`,
        values: [{idClient, idPersAsisoc, start, stop, tip}]
    }
}

export function getUserLocation(imei: string) {
    return {
        text: `select st_astext(ul.location)
               from "ingrijiriPaleative".users u
                        inner join "ingrijiriPaleative"."usersLocation" ul on ul."idUser" = u.id
               where u.imei = $1`,
        values: [imei]
    }
}
