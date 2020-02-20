CREATE TABLE IF NOT EXISTS bienes(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    codigo TEXT,
    tipo TEXT,
    idUbicacion INTEGER,
    precioEstimado REAL,
    observaciones TEXT,
    sincronizado INTEGER,
    codigoPadre TEXT
);

CREATE TABLE IF NOT EXISTS ubicaciones(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT
);

CREATE TABLE IF NOT EXISTS tareas(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idUbicacion INTEGER,
    idUsuario INTEGER,
    fechaHoraInicio TEXT,
    fechaHoraFin TEXT,
    completada INTEGER,
    tipo TEXT,
    observaciones TEXT
);

CREATE TABLE IF NOT EXISTS bajas(
    idTarea INTEGER,
    descripcion TEXT,
    foto BLOB
);

CREATE TABLE IF NOT EXISTS conteos(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idTarea INTEGER,
    numeroDeBienes TEXT,
    pendiente INTEGER
);

CREATE TABLE IF NOT EXISTS bienesContados(
    idConteo INTEGER,
    codigoBarras TEXT
);

CREATE TABLE IF NOT EXISTS registros(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idTarea INTEGER,
    idBien INTEGER
);

INSERT INTO bienes (nombre, codigo, tipo, idUbicacion, precioEstimado, observaciones, sincronizado) VALUES ('maquina del tiempo', '128379348789', 'CONTROL ADMINISTRATIVO', 1, 0.25, 'visaje', 0);