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
				"## This version doesn't exploit any ontology for sample properties.\n" +
				"#\n" +
				"SELECT DISTINCT ?smp ?pvLabel ?propTypeLabel ?repoName ?repoAcc ?repoUrl\n" +
				"WHERE \n" +
				"{\n" +
				"  ?smp\n" +
				"    a biosd-terms:Sample;\n" +
				"    biosd-terms:has-bio-characteristic | sio:SIO_000332 ?pv; # is about\n" +
				"    pav:derivedFrom ?webRec.\n" +
				"\n" +
				"  ?pv\n" +
				"    rdfs:label ?pvLabel;\n" +
				"    biosd-terms:has-bio-characteristic-type ?pvType.\n" +
				"  \n" +
				"  ?pvType \n" +
				"    rdfs:label ?propTypeLabel.\n" +
				"\n" +
				"\n" +
				"  FILTER ( LCASE ( STR ( ?propTypeLabel ) ) = \"organism\" ).\n" +
				"  FILTER ( LCASE ( STR ( ?pvLabel ) ) = \"homo sapiens\" ).\n" +
				"\n" +
				"  ?webRec\n" +
				"    dcterms:identifier ?repoAcc;\n" +
				"    dcterms:source ?repoName;\n" +
				"    foaf:page ?repoUrl.\n" +
				"}\n"
    },

    {
      shortname: "Samples that derives from a given genus",
      description: 
      	"Samples derived from the mus mus genus or specific organisms under it, as they are classified by." +
        " the NCBI Taxonomy.",
      query:
				"#\n" +
				"## All samples that derives from a given genus (Mus)\n" +
				"#\n" +
				"SELECT DISTINCT ?smp ?pvLabel ?propTypeLabel\n" +
				"WHERE {\n" +
				"  ?smp biosd-terms:has-bio-characteristic ?pv.\n" +
				"  \n" +
				"  ?pv biosd-terms:has-bio-characteristic-type ?pvType;\n" +
				"      rdfs:label ?pvLabel.\n" +
				"  \n" +
				"  ?pvType a ?pvTypeClass.\n" +
				"  \n" +
				"  # Mus\n" +
				"  ?pvTypeClass \n" +
				"    rdfs:label ?propTypeLabel;\n" +
				"    # '*' gives you transitive closure, even when inference is disabled  \n" +
				"    rdfs:subClassOf* <http://purl.obolibrary.org/obo/NCBITaxon_10088>    \n" +
				"}\n"
    },

    {
      shortname: "Samples treated with alcohol",
      description: 
      	"Samples treated with a compound of 'alchool' type, or a more specific type of alchool." +
        " This is made through a query over the bioportal sparql endpoint (i.e., a federated query).",
      query:
				"#\n" +
				"## All samples treated with a compound of 'alchool' type or a more specific alchool type\n" +
				"#  this is made through a query over the bioportal sparql endpoint (ie, a federated query)\n" +
				"#\n" +
				"SELECT DISTINCT ?smp ?pvLabel ?pvTypeLabel ?pvTypeClass\n" +
				"{\n" +
				"  SERVICE <http://sparql.bioontology.org/ontologies/sparql/?apikey=c6ae1b27-9f86-4e3c-9dcf-087e1156eabe> \n" +
				"  {\n" +
				"    ?pvTypeClass \n" +
				"      rdfs:subClassOf <http://purl.obolibrary.org/obo/CHEBI_30879>; \n" +
				"      rdfs:label ?pvTypeLabel.\n" +
				"  }\n" +
				"\n" +
				"  ?pvType \n" +
				"    a ?pvTypeClass. \n" +
				"\n" +
				"  ?pv \n" +
				"    biosd-terms:has-bio-characteristic-type ?pvType;\n" +
				"    rdfs:label ?pvLabel.\n" +
				"  \n" +
				"  ?smp \n" +
				"    a biosd-terms:Sample;\n" +
				"    biosd-terms:has-bio-characteristic ?pv.\n" +
				"}\n"
    },

    {
        shortname :
        	"Temperature values and units",
        description:
        	"This shows how numerical values and units are represented in RDF. When possible, dates are detected and represented " + 
        	"the same way, using xsd^dateTime. This query requires that you tick on the inference box.",
        query: 
					"#\n" +
					"## Samples with temperature attributes. DO REQUIRE Inference enabled\n" +
					"#\n" +
					"select distinct ?smp ?pvTypeLabel ?tvalLabel ?tval ?unitLabel\n" +
					"{\n" +
					"  ?smp \n" +
					"    a biosd-terms:Sample;\n" +
					"    biosd-terms:has-bio-characteristic | sio:SIO_000332 ?tPv. # is about\n" +
					"    \n" +
					"  ?tPv \n" +
					"    sio:SIO_000300 ?tval; # sio:has value\n" +
					"    rdfs:label ?tvalLabel; # contains a string composed with value and unit\n" +
					"    sio:SIO_000221 [ # sio:has unit\n" +
					"      a obo:UO_0000027; # temperature\n" +
					"      rdfs:label ?unitLabel\n" +
					"    ].\n" +
					"    \n" +
					"  ?tPv biosd-terms:has-bio-characteristic-type ?pvType.\n" +
					"  ?pvType rdfs:label ?pvTypeLabel \n" +
					"}\n"
			}, 
			
	    {
        shortname :
        	"Attribute values with intervals.",
        description:
        	"This shows how numerical ranges are represented in RDF. When possible, date ranges are detected and " +  
        	"represented the same way, using xsd^dateTime.",
        query:
					"#\n" +
					"# Property values with ranges\n" +
					"#\n" +
					"select distinct ?item ?lo ?hi ?vlabel ?pTypeLabel ?unitClass \n" +
					"where \n" +
					"{\n" +
					"  ?item biosd-terms:has-bio-characteristic ?pv.\n" +
					"    \n" +
					"  ?pv \n" +
					"    biosd-terms:has-bio-characteristic-type ?ptype;\n" +
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
					"    biosd-terms:has-bio-characteristic-type [ rdfs:label ?latLabel];\n" +
					"    sio:SIO_000300 ?latVal. # sio:has value\n" +
					"\n" +
					"  FILTER ( REGEX ( ?latLabel, \"latitude\", \"i\" ) ).\n" +
					"       \n" +
					"  ?longPv \n" +
					"    biosd-terms:has-bio-characteristic-type [ rdfs:label ?longLabel ];\n" +
					"    sio:SIO_000300 ?longVal. # sio:has value\n" +
					"\n" +
					"  FILTER ( REGEX ( ?longLabel, \"longitude\", \"i\" ) ).\n" +
					"}\n"
			},
			{
	      shortname :
	      	"Provenance Graph",
	      description:
	      	"Shows how samples were derived from other samples.",
	      query:
					"#\n" +
					"# Derivation relationships\n" +
					"#\n" +
					"SELECT DISTINCT ?smpTo ?smpFrom WHERE {\n" +
	      	"	{ ?smpTo prov:wasDerivedFrom ?smpFrom } # Every statement like this has also sio:SIO_000244 (derived from)\n" +
	      	"		UNION { ?smpFrom sio:SIO_000245 ?smpTo } # this is derived into and there is no equivalent in prov\n" +
	      	"}\n"
			}			
]
