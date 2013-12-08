/*
 * Copyright (c) 2013 EMBL - European Bioinformatics Institute
 * Licensed under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

var exampleQueries = [

    {
        shortname :
        	"Show main resources",
        description:
        	"An example that selects Sample Groups, Samples, the main resource types in the dataset.",
        query: 
					"SELECT DISTINCT *\n" +
					"WHERE {\n" +
					"  { select ?item WHERE { ?item a biosd-terms:BiosamplesSubmission. } LIMIT 3}\n" +
					"  UNION { select ?item { ?item a biosd-terms:SampleGroup. } LIMIT 3 }\n" +
					"  UNION { select ?item { ?item a biosd-terms:Sample. } LIMIT 3 }\n" +
					"}\n"
    },
    
    {
      shortname: 
        "Samples from homo sapiens and their provenance",
      description: 
        "Shows how to get and filter sample attributes. It also shows how the web pages on the provenance databases are linked.",
      query:        
				"#\n" +
				"## Samples with a given property value and type, and external links\n" +
				"#\n" +
				"SELECT DISTINCT ?smp ?pvLabel ?propTypeLabel ?repoName ?repoAcc ?repoUrl\n" +
				"WHERE {\n" +
				"  ?smp\n" +
				"    a biosd-terms:Sample;\n" +
				"    biosd-terms:has-bio-characteristic|obo:IAO_0000136 ?pv; # is about\n" +
				"    pav:derivedFrom ?webRec.\n" +
				"\n" +
				"  ?pv\n" + 
				"    a ?pvType;\n" +
				"    rdfs:label ?pvLabel.\n" +
				"\n" +
				"  ?pvType\n" + 
				"    rdfs:label ?propTypeLabel.\n" +
				"\n" +
				"  FILTER ( REGEX ( STR ( ?propTypeLabel ), \"^organism$\", \"i\" ) ).\n" +
				"  FILTER ( REGEX ( STR ( ?pvLabel ), \".*sapiens.*\", \"i\" ) ).\n" +
				"\n" +
				"  ?webRec\n" +
				"    dcterms:identifier ?repoAcc;\n" +
				"    dcterms:source ?repoName;\n" +
				"    foaf:page ?repoUrl.\n" +
				"}\n" 
    },

    {
      shortname: "Samples treated with monocyclic heteroarene",
      description: 
      	"Samples treated with a compound of 'monocyclic heteroarene' type." +
        " This is made through a query over the bioportal sparql endpoint (i.e., a federated query).",
      query:
				"\n" +
				"# For each subclass of a given CHEBI compound, find samples annotated with\n" +
				"# it.\n" +
				"\n" +
				"select distinct ?smp ?pvLabel ?propTypeLabel ?pvType\n" +
				"{\n" +
				"  SERVICE <http://sparql.bioontology.org/ontologies/sparql/?apikey=c6ae1b27-9f86-4e3c-9dcf-087e1156eabe> {\n" +
				"    ?pvType rdfs:subClassOf <http://purl.obolibrary.org/obo/CHEBI_38179>; # monocyclic heteroarene\n" +
				"            rdfs:label ?pvTypeLabel.\n" +
				"  }\n" +
				"\n" +
				"  ?smp \n" +
				"    a biosd-terms:Sample;\n" +
				"    biosd-terms:has-bio-characteristic ?pv.\n" +
				"  \n" +
				"  ?pv a ?pvType;\n" +
				"      rdfs:label ?pvLabel.\n" +
				"  \n" +
				"  ?pvType rdfs:label ?propTypeLabel.\n" +
				"\n" +
				"}\n"
    },

    {
        shortname :
        	"Weight values and units",
        description:
        	"This shows how numerical values and units are represented in RDF. When possible, dates are detected and represented " + 
        	"the same way, using xsd^dateTime.",
        query: 
					"# \n" +
					"# Weight values and units\n" +
					"#\n" +
					"select distinct ?smp ?wval ?wvalLabel ?wunitLabel ?wunitClass\n" +
					"where {\n" +
					"  ?smp \n" +
					"    a biosd-terms:Sample;\n" +
					"    biosd-terms:has-bio-characteristic ?wPv.\n" +
					"    \n" +
					"  ?wPv \n" +
					"    a [ rdfs:label ?wlabel];\n" +
					"    sio:SIO_000300 ?wval; # sio:has value\n" +
					"    rdfs:label ?wvalLabel; # contains a string composed with value and unit\n" +
					"    sio:SIO_000221 [ # sio:has unit\n" +
					"      a ?wunitClass;\n" +
					"      rdfs:label ?wunitLabel # contains the original label given to the unit\n" +
					"    ]. \n" +
					"\n" +
					"  FILTER ( ?wunitClass != owl:NamedIndividual ).  \n" +
					"  FILTER ( ?wunitClass != sio:SIO_000074 ). # unit, obvious  \n" +
					"  FILTER ( REGEX ( ?wlabel, \"weight\", \"i\" ) ).\n" +
					"}\n"    
			}, 
			
	    {
        shortname :
        	"Attribute values with intervals.",
        description:
        	"This shows how numerical ranges are represented in RDF. When possible, dates are detected and represented " + 
        	"the same way, using xsd^dateTime.",
        query:
					"# \n" +
					"# Property values with ranges\n" +
					"#\n" +
					"select distinct ?item ?lo ?hi ?vlabel ?pTypeLabel ?unitClass \n" +
					"where \n" +
					"{\n" +
					"  ?item biosd-terms:has-bio-characteristic ?pv.\n" +
					"    \n" +
					"  ?pv \n" +
					"    a ?ptype;\n" +
					"    biosd-terms:has-low-value ?lo;\n" +
					"    biosd-terms:has-high-value ?hi;\n" +
					"    rdfs:label ?vlabel. # contains a string composed with value and unit\n" +
					"\n" +
					"  ?ptype\n" +
					"    rdfs:label ?pTypeLabel.\n" +
					"  \n" +
					"  FILTER ( ?ptype != sio:SIO_000944 ). # interval, obvious\n" +
					"  \n" +
					"  \n" +
					"  OPTIONAL {               \n" +
					"    ?pv \n" +
					"      sio:SIO_000221 [ # sio:has unit\n" +
					"      a ?unitClass;\n" +
					"    ]. \n" +
					"    FILTER ( ?unitClass != owl:NamedIndividual ).  \n" +
					"    FILTER ( ?unitClass != sio:SIO_000074 ). # unit, obvious  \n" +
					"  }\n" +
					"}\n"         
			}, 
			
			{
        shortname :
        	"Geographically located samples",
        description:
        	"Another query based on numerical values, to find samples associated to a latitude and longitude.",
        query: 			
          "#\n" + 
          "# Samples reporting latitude and longitude\n" +
          "#\n" +
					"SELECT DISTINCT ?item ?latVal ?longVal WHERE {\n" +
					"  ?item biosd-terms:has-bio-characteristic ?latPv, ?longPv.\n" +
					"    \n" +
					"  ?latPv \n" +
					"    a [ rdfs:label ?latLabel];\n" +
					"    sio:SIO_000300 ?latVal. # sio:has value\n" +
					"\n" +
					"  FILTER ( REGEX ( ?latLabel, \"latitude\", \"i\" ) ).\n" +
					"       \n" +
					"  ?longPv \n" +
					"    a [ rdfs:label ?longLabel ];\n" +
					"    sio:SIO_000300 ?longVal. # sio:has value\n" +
					"\n" +
					"  FILTER ( REGEX ( ?longLabel, \"longitude\", \"i\" ) ).\n" +
					"}\n"
			}		
]
