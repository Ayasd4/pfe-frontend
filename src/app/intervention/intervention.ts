import { Atelier } from "../atelier/atelier"
import { Travaux } from "../ordre/travaux"
import { Technicien } from "../technicien/technicien"

export interface Intervention {
    id_intervention: number,
    ordre: {
        id_ordre: number,
        diagnostic: {
            id_diagnostic: number,
            demande: {
                vehicule: { numparc: number }
            },
        }
        nom_travail: string,
        urgence_panne: string,
        planning: string,
        date_ordre: string,
        status: string,
        atelier: Atelier,
        technicien: Technicien,
    },
    technicien: {
        id_technicien: 0,
        nom: string,
        prenom: string,
        matricule_techn: number,
        email_techn: string,
        specialite: string,
    }
    date_debut: string,
    heure_debut: string,
    date_fin: string,
    heure_fin: string,
    status_intervention: string,
    commentaire: string,
    atelier: {
        nom_atelier: string,
        telephone: string,
        email: string
    }

}