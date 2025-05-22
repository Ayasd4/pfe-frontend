import { Atelier } from "src/app/atelier/atelier"
import { Travaux } from "src/app/ordre/travaux"
import { Technicien } from "src/app/technicien/technicien"

export interface Consulter {
    id_ordre: number,
        diagnostic: {
            id_diagnostic: number,
            demande: {
                id_demande: number,
                type_avarie: string,
                description: string,
                vehicule: { numparc: number }
            },
            description_panne: string,
            causes_panne: string,
            actions: string,
            date_diagnostic: string,
            heure_diagnostic: string
        },
        urgence_panne: string,
        travaux: Travaux,
        planning: string,
        date_ordre: string,
        status: string,
        atelier: Atelier,
        technicien: Technicien,
}
