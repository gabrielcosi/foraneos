package com.foraneos.Document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Map;

@Document(collection = "Universidades")
public class Universidad implements Serializable {
    
    @NotNull
    private String id;

    @NotNull
    private String nombre;

    
    private Map<String, Object> coordenadas;

    public Map<String, Object> getCoordenadas() {
		return coordenadas;
	}

	public void setCoordenadas(Map<String, Object> coordenadas) {
		this.coordenadas = coordenadas;
	}

	public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
