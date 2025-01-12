import {Request, Response} from "express"
import { format, differenceInMinutes } from "date-fns";
const pool = require("../repositories/connection");



const collaboratorCode = async (req: Request, res: Response) => {

    const { contributor_code } = req.body;

    try {

        if(!contributor_code) {
            return res.status(400).json({ message: "Você precisa fornecer o seu codigo de usuario!" });
        }

        const queryCheck = "SELECT * FROM collaborators WHERE contributor_code = $1";
        const { rowCount, rows } = await pool.query(queryCheck, [contributor_code]);

        if (rowCount > 0) {
            return res.status(201).json({ message: "Usuário logado com sucesso!" });
        }
        
        const params = [contributor_code];
        const query = "insert into collaborators (contributor_code) values($1)"

        const { rows: collaborators } = await pool.query(query, params);

        return res.status(201).json({ message: "Usuário logado com sucesso!" });
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ "error_description": error });
    }
}

 const registerEntry = async (req: Request, res: Response) => {

    const {contributor_code, start_time} = req.body;
 
        try {   
        
        if(!contributor_code || !start_time) {
            return res.status(400).json({ message: "Você precisa fornecer o seu codigo de usuario e a hora inicial!" });
        } 

        const queryCheck = "SELECT * FROM collaborators WHERE contributor_code = $1";
        const { rows } = await pool.query(queryCheck, [contributor_code]);
        const contributor_id = rows[0].id;
        
        const formattedStartTime = format(new Date(start_time), "yyyy-MM-dd HH:mm:ss");
       
        if(rows.length > 0) {
        
            const query = "INSERT INTO point_records (contributor_id, start_time) VALUES ($1, $2)";
            const params = [contributor_id, formattedStartTime];
            const {rows} = await pool.query(query, params);

            return res.status(201).json({ message: "Entrada registrada com sucesso!" });

        }

        } catch (error) {
            console.log(error);
            return res.status(500).json({ "error_description": error });
        }

}

const registerExit = async (req: Request, res: Response) => {
    const { contributor_code, end_time } = req.body;

    try {
        if (!contributor_code || !end_time) {
            return res.status(400).json({ message: "Você precisa fornecer o seu código de usuário e a hora de saída!" });
        }

        const queryCheck = "SELECT * FROM collaborators WHERE contributor_code = $1";
        const { rows } = await pool.query(queryCheck, [contributor_code]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Colaborador não encontrado!" });
        }

        const contributor_id = rows[0].id;

        const queryEntry = "SELECT * FROM point_records WHERE contributor_id = $1 AND end_time IS NULL";
        const entryResult = await pool.query(queryEntry, [contributor_id]);

        if (entryResult.rows.length === 0) {
            return res.status(400).json({ message: "Não há registro de entrada para este colaborador!" });
        }

        const start_time = entryResult.rows[0].start_time;
        const formattedEndTime = format(new Date(end_time), "yyyy-MM-dd HH:mm:ss"); 

        const durationInMinutes = differenceInMinutes(new Date(formattedEndTime), new Date(start_time));
        const hours = Math.floor(durationInMinutes / 60);
        const minutes = durationInMinutes % 60;
        const duration = `${hours}h ${minutes}m`;


        const updateQuery = "UPDATE point_records SET end_time = $1, duration = $2 WHERE contributor_id = $3 AND end_time IS NULL";
        const updateParams = [formattedEndTime, duration, contributor_id];
        await pool.query(updateQuery, updateParams);

        return res.status(201).json({ message: "Saída registrada com sucesso!" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ "error_description": error });
    }
};

const getRegisters = async (req: Request, res: Response) => {
    const { contributor_code } = req.params;
        try {
            if(!contributor_code) {
                return res.status(400).json({ message: "Você precisa fornecer o seu codigo de usuario!" });
            }

            const queryCheck = "SELECT * FROM collaborators WHERE contributor_code = $1";
            const { rows: collaborators } = await pool.query(queryCheck, [contributor_code]);
            const contributor_id = collaborators[0].id;

            const query = "SELECT start_time, end_time, duration FROM point_records WHERE contributor_id = $1 ORDER BY start_time DESC"        
            const params = [contributor_id]
            const { rows: register } = await pool.query(query, params);
        
            return res.status(202).json({register});
        
        } catch (error) {
            return res.status(500).json({ "error_description": error });
        }

};


 module.exports = {
    collaboratorCode,
    registerEntry,
    registerExit,
    getRegisters
 }

