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
        shortname : "All submissions",
        description: "All the SampleTab Submissions",
        query: 
          "select distinct *\n" + 
          "where { ?s a biosd-terms:BiosamplesSubmission }\n" +
          "limit 100"
    },
    
    {
      shortname: "All Samples",
        description: "All the repository biological samples",
        query: "select distinct *\nwhere {\n  ?s a obo:OBI_0000747 # material sample\n}limit 100"
    },

    {
      shortname: "Samples from Listeria",
        description: "Samples derived from NCBITax:1637 or subclasses (you need to activate RDFS inference)",
        query:
"select distinct ?smp ?pvLabel ?propTypeLabel\n" +
"where {\n" +
"  ?smp biosd-terms:has-bio-characteristic ?pv.\n" +
"\n" +  
"  ?pv a ?pvType;\n" +
"      rdfs:label ?pvLabel.\n" +
"\n" +  
"  ?pvType rdfs:label ?propTypeLabel.\n" +
"\n" +  
"  # Lysteria\n" +
"  ?pvType rdfs:subClassOf <http://purl.obolibrary.org/obo/NCBITaxon_1637>\n" +
"} limit 100\n" 
    },

    {
      shortname: "Samples treated with monocyclic heteroarene",
        description: "Samples treated with a compound of 'monocyclic heteroarene' type." +
          " This is made through a query over the bioportal sparql endpoint (ie, a federated query).",
        query:
"select distinct ?smp ?pvTypeLabel\n" + 
"{\n" +
"  # TODO: Bioportal do require that you use an API key and this is the one being used by the OntoCat package\n" +
"  # we have to get a new one.\n" +
"  SERVICE <http://sparql.bioontology.org/ontologies/sparql/?apikey=c6ae1b27-9f86-4e3c-9dcf-087e1156eabe> {\n" +
"    ?pvType rdfs:subClassOf <http://purl.obolibrary.org/obo/CHEBI_38179>;\n" +
"            rdfs:label ?pvTypeLabel.\n" +
"  }\n" +
"\n" +  
"  ?pv a ?pvType.\n" +
"\n" +
"  ?smp biosd-terms:has-bio-characteristic ?pv.\n" +
"} limit 100\n"
    },

    {
      shortname: "Samples coming from ArrayExpress",
        description: "Discovers all the samples that comes from the ArrayExpress repository. " +
         "Please note that this is a temporary hack to cover the lack of certain links.",
        query:
"select distinct ?smp ?aeAcc\n" +
"{\n" +
"  ?sub a biosd-terms:BiosamplesSubmission.\n" +
"  ?sub obo:IAO_0000219 ?smp. # denotes\n" +
"  ?smp a obo:OBI_0000747 # material sample\n" +
"\n" +  
"  FILTER ( REGEX ( ?sub, \".*/GAE-.+$\" ) ).\n" +
"  BIND( STRAFTER ( str ( ?sub ), \"http://rdf.ebi.ac.uk/resource/biosamples/msi/GAE-\" ) as ?aeAcc ).\n" +
"} limit 100\n"
    }
]
